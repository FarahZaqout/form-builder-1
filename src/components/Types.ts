
export interface Field {
    doctype: string;
    name: string;
    creation: string;
    modified: string;
    modified_by: string;
    owner: string;
    docstatus: number;
    parent: string;
    parentfield: string;
    parenttype: string;
    idx: number;
    fieldname: string;
    label: string;
    fieldtype: 'Text' | 'Number' | 'Email' | 'Date' | 'Select' | 'Checkbox' | 'TextArea' | 'Section Break' | 'FileUpload' | 'Column Break';
    options?: string;
    search_index: number;
    show_dashboard: number;
    hidden: number;
    set_only_once: number;
    allow_in_quick_entry: number;
    print_hide: number;
    report_hide: number;
    reqd: number;
    bold: number;
    in_global_search: number;
    collapsible: number;
    unique: number;
    no_copy: number;
    allow_on_submit: number;
    show_preview_popup: number;
    permlevel: number;
    ignore_user_permissions: number;
    columns: number;
    in_list_view: number;
    fetch_if_empty: number;
    in_filter: number;
    remember_last_selected_value: number;
    ignore_xss_filter: number;
    print_hide_if_no_value: number;
    allow_bulk_edit: number;
    in_standard_filter: number;
    in_preview: number;
    read_only: boolean;
    length: number;
    translatable: number;
    hide_border: number;
    hide_days: number;
    hide_seconds: number;
    non_negative: number;
    is_virtual: number;
    sort_options: number;
    default: string;
}

export interface Document {
    doctype: string;
    name: string;
    fields: Field[];
}

export interface FrappeObject {
    docs: Document[];
}

export interface CustomComponents {
    [key: string]: React.ComponentType<{ field: any, config: Field }>;
}

// todo: optimize 
export interface ExtendedField extends Field {
    fields?: ExtendedField[];
}
