import {compare, hash} from "@services/hasher";

test('Hash and Compare test', () => {
	const testString = "TEST"
	const _hash = hash(testString);

	const result = compare(testString, _hash);

	expect(result).toBe(true);
})