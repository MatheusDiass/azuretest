import { describe, it, expect } from "vitest";

describe('Test only', () => {
    it('Test only', () => {
        const name = process.env.NAME;

        expect(name).toEqual('Matheus');
    })
})