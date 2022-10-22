
// Compare an initialized object with another to check that all fields defined

// exist in both
export function ensureFieldsPresent(obj: any, template: any, saveType: any): any {
    const templateKeys = Object.keys(template);

    const combined: any = new saveType();
    templateKeys.forEach((curr: string) => {
        if(obj[curr] === undefined) {
            combined[curr] = template[curr];
        } else {
            combined[curr] = obj[curr];
        }
    });

    return combined;
}