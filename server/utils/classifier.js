export function classifyStudent(points) {
    if (points >= 90) return 'OUTSTANDING';
    if (points >= 80) return 'EXCELLENT';
    if (points >= 60) return 'AVERAGE';
    return 'LOW';
}

export function getReferenceGroup(category) {
    switch (category) {
        case 'OUTSTANDING':
            return ['OUTSTANDING'];
        case 'EXCELLENT':
            return ['OUTSTANDING', 'EXCELLENT'];
        case 'AVERAGE':
            return ['EXCELLENT', 'AVERAGE'];
        case 'LOW':
            return ['AVERAGE'];
        default:
            return [];
    }
}
