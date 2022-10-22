
//  Compare an initialized object with another to ensure that
//  all fields defined within the template exist on the resulting
//  object
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