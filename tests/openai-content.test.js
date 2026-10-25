import assert from 'node:assert/strict';
import test from 'node:test';
import {
    admitOpenAiUserContent,
    assertUserImageInputSupported,
    ImageInputFailure,
    MAX_IMAGES_PER_REQUEST,
    MAX_TOTAL_IMAGE_BYTES,
} from '../lib/openai-content.js';

test('rejects image input only when model metadata explicitly excludes it', () => {
    const messages = [{
        role: 'user',
        content: [{ type: 'image_url', image_url: { url: 'https://images.example/photo.png' } }],
    }];
    assert.throws(
        () => assertUserImageInputSupported(messages, ['text']),
        (error) => error instanceof ImageInputFailure && error.status === 400 && error.code === 'unsupported_content',
    );
    assert.doesNotThrow(() => assertUserImageInputSupported(messages, ['text', 'image']));
    assert.doesNotThrow(() => assertUserImageInputSupported(messages, undefined));
    assert.doesNotThrow(() => assertUserImageInputSupported([{ role: 'assistant', content: messages[0].content }], ['text']));
});

test('enforces a request-wide image count before fetching', async () => {
    const imagePart = { type: 'image_url', image_url: { url: 'https://images.example/photo.png' } };
    const content = Array.from({ length: MAX_IMAGES_PER_REQUEST + 1 }, () => imagePart);
    let reads = 0;
    await assert.rejects(admitOpenAiUserContent(content, 0, {
        attachments: { async admitPromptContent(parts) { return parts; } },
        async readImageUrl() { reads += 1; return { data: Buffer.from([1]), mediaType: 'image/png' }; },
    }), (error) => error instanceof ImageInputFailure && error.status === 400 && error.code === 'invalid_request_error');
    assert.equal(reads, 0);
    assert.throws(
        () => assertUserImageInputSupported(Array.from({ length: MAX_IMAGES_PER_REQUEST + 1 }, () => ({ role: 'user', content: [imagePart] })), ['image']),
        (error) => error instanceof ImageInputFailure && error.code === 'invalid_request_error',
    );
});

test('enforces aggregate image bytes while fetching each image', async () => {
    const imageBudget = { imageCount: 1, imageBytes: MAX_TOTAL_IMAGE_BYTES - 2 };
    let maxBytes;
    await assert.rejects(admitOpenAiUserContent([
        { type: 'image_url', image_url: { url: 'https://images.example/photo.png' } },
    ], 0, {
        imageBudget,
        attachments: { async admitPromptContent(parts) { return parts; } },
        async readImageUrl(_url, options) {
            maxBytes = options.maxBytes;
            return { data: Buffer.from([1, 2, 3]), mediaType: 'image/png' };
        },
    }), (error) => error instanceof ImageInputFailure && error.status === 413 && error.code === 'request_too_large');
    assert.equal(maxBytes, 2);
    assert.equal(imageBudget.imageBytes, MAX_TOTAL_IMAGE_BYTES - 2);
});

test('text-only messages keep their text content', async () => {
    assert.deepEqual(await admitOpenAiUserContent('hello', 0), [{ type: 'text', text: 'hello' }]);
});

test('mixed user text and image content is admitted in order', async () => {
    const imageBytes = Buffer.from([1, 2, 3]);
    let admitted;
    const attachments = {
        async admitPromptContent(content) {
            admitted = content;
            return content.map((part) => part.type === 'image'
                ? { type: 'image', attachment: { id: 'attachment-1' } }
                : part);
        },
    };
    const result = await admitOpenAiUserContent([
        { type: 'text', text: 'before' },
        { type: 'image_url', image_url: { url: 'https://images.example/photo.png', detail: 'high' } },
        { type: 'input_text', text: 'after' },
    ], 2, {
        attachments,
        async readImageUrl(url) {
            assert.equal(url, 'https://images.example/photo.png');
            return { data: imageBytes, mediaType: 'image/png' };
        },
    });
    assert.deepEqual(admitted.map((part) => part.type), ['text', 'image', 'text']);
    assert.equal(admitted[1].data, imageBytes);
    assert.deepEqual(result, [
        { type: 'text', text: 'before' },
        { type: 'image', attachment: { id: 'attachment-1' } },
        { type: 'text', text: 'after' },
    ]);
});

test('image inputs require the Harness attachment service', async () => {
    await assert.rejects(
        admitOpenAiUserContent([{ type: 'image_url', image_url: { url: 'data:image/png;base64,AQI' } }], 0),
        (error) => error instanceof ImageInputFailure && error.status === 503 && error.code === 'attachment_service_unavailable',
    );
});

test('unsupported content parts retain an OpenAI unsupported_content error', async () => {
    await assert.rejects(
        admitOpenAiUserContent([{ type: 'audio', data: '...' }], 4),
        (error) => error instanceof ImageInputFailure
            && error.status === 400
            && error.code === 'unsupported_content'
            && error.message.includes('messages[4]'),
    );
});

test('attachment capacity errors become bounded client errors', async () => {
    await assert.rejects(
        admitOpenAiUserContent([{ type: 'image_url', image_url: { url: 'data:image/png;base64,AQI' } }], 0, {
            attachments: { async admitPromptContent() { throw Object.assign(new Error('too many'), { code: 'TOO_MANY_IMAGES' }); } },
        }),
        (error) => error instanceof ImageInputFailure && error.status === 400 && error.code === 'invalid_request_error',
    );
});
