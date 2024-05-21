// Type definitions for document and field structures
interface Field {
    permlevel?: number;
    ignore_user_permissions?: number;
    hidden?: number;
    read_only?: number;
    label?: string;
    collapsible?: number;
    default?: any;
    reqd?: number;
    unique?: number;
    search_index?: number;
    show_dashboard?: number;
    bold?: number;
    fieldtype?: string;
    options?: string;
    "aria-labels"?: string;
    "aria-describedby"?: string;
    role?: string;
    placeholder?: string;
    autofocus?: string;
    autocomplete?: string;
    pattern?: string;
    required?: boolean;
    name?: string;
    id?: string;
    title?: string;
    [key: string]: any;
}

interface Document {
    doctype: string;
    name: string;
    fields: Field[];
}

interface SimplifyOptions {
    docIndex?: number;
    children?: string;
}

function simplifyJSON(json: { docs: Document[] }, options: SimplifyOptions): Document | Document[] {
    const { docIndex, children } = options;
    const includedFields: string[] = [
        "permlevel", "ignore_user_permissions", "hidden", "read_only", "label",
        "collapsible", "default", "reqd", "unique", "search_index", "show_dashboard",
        "bold", "fieldtype", "options", "aria-labels", "aria-describedby", "role",
        "placeholder", "autofocus", "autocomplete", "pattern", "required", "name",
        "id", "title", "fields",
    ];

    function extractFields(fields: Field[]): Field[] {
        return fields.map(field => {
            const filteredField: Field = {};
            includedFields.forEach(key => {
                if (field[key] !== undefined) {
                    if (key === children && Array.isArray(field[key])) {
                        filteredField[key] = extractFields(field[key] as Field[]);
                    } else {
                        filteredField[key] = field[key];
                    }
                }
            });
            return filteredField;
        });
    }

    function simplifyDoc(doc: Document): Document {
        return {
            doctype: doc.doctype,
            name: doc.name,
            fields: extractFields(doc.fields)
        };
    }

    // docIndex is optional. If provided, traverse specific doc; otherwise, traverse all.
    if (typeof docIndex === 'number' && docIndex >= 0 && docIndex < json.docs.length) {
        return simplifyDoc(json.docs[docIndex]);
    } else {
        return json.docs.map(doc => simplifyDoc(doc));
    }
}

// Example usage:

export default simplifyJSON;