import {createHash} from "crypto";

export function DeterministicUUID(str: string) {
    const hash = createHash('sha256')
        .update(str)
        .digest('hex');

    const uuidData = [
        hash.slice(0, 4),
        hash.slice(4, 8),
        hash.slice(8, 12),
        hash.slice(12, 16),
    ]

    const uuid = uuidData.join('-');

    return uuid.toUpperCase()
}
