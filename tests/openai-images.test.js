import assert from 'node:assert/strict';
import test from 'node:test';
import { decodeImageDataUrl, isPublicAddress, MAX_IMAGE_BYTES, readOpenAiImageUrl, ImageInputFailure } from '../lib/openai-images.js';

test('base64 image data URLs decode even when padding is omitted', () => {
    const image = decodeImageDataUrl('data:image/png;base64,AQI');
    assert.equal(image.mediaType, 'image/png');
    assert.deepEqual([...image.data], [1, 2]);
});

test('invalid base64 and non-image media types are rejected', () => {
    assert.throws(() => decodeImageDataUrl('data:image/png;base64,%%%'), ImageInputFailure);
    assert.throws(() => decodeImageDataUrl('data:image/svg+xml;base64,PHN2Zz4='), (error) => error.code === 'unsupported_content');
});

test('oversized data URL payloads are rejected before decoding', () => {
    const encoded = 'A'.repeat(Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 5);
    assert.throws(() => decodeImageDataUrl('data:image/png;base64,' + encoded), (error) => error.status === 413 && error.code === 'request_too_large');
});

test('remote fetch rejects loopback, local names, and non-default ports', async () => {
    for (const url of ['http://127.0.0.1/image.png', 'http://localhost/image.png', 'http://example.com:8080/image.png']) {
        await assert.rejects(readOpenAiImageUrl(url), ImageInputFailure);
    }
});

test('address filter accepts public addresses and blocks reserved ranges', () => {
    assert.equal(isPublicAddress('8.8.8.8'), true);
    assert.equal(isPublicAddress('2001:4860:4860::8888'), true);
    for (const address of ['127.0.0.1', '10.0.0.1', '100.64.0.1', '169.254.169.254', '192.168.1.1', '::1', 'fc00::1', 'fe80::1', 'ff02::1', '2001:db8::1', '3fff::1']) {
        assert.equal(isPublicAddress(address), false, address);
    }
});
