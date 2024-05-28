'use client';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { frappe2 } from './frappe2';

interface Field {
    // Field properties
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
    fieldtype: 'Text' | 'Number' | 'Email' | 'Date' | 'Select' | 'Checkbox' | 'TextArea' | 'Section Break';
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

interface Document {
    doctype: string;
    name: string;
    fields: Field[];
}

interface FrappeObject {
    docs: Document[];
}

interface CustomComponents {
    [key: string]: React.ComponentType<{ field: any, config: Field }>;
}

const DefaultComponents: CustomComponents = {
    Text: ({ field, config }) => (
        <input type="text" {...field} placeholder={config.label} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    // Include other components similarly
};

// reapply recursion.
const createFieldConfig = (formFields: FrappeObject): Field[] => {
    const configurations: Field[] = [];
    formFields.docs.forEach(doc => {
        doc.fields.forEach(field => {
            configurations.push(field);
        });
    });
    return configurations;
};

function getComponent(fieldType: string): React.ComponentType<{ field: any, config: Field }> {
    // Default to Text if no matching component found
    return DefaultComponents[fieldType] || DefaultComponents.Text;
}
//@ts-ignore
const fieldConfigurations = createFieldConfig(frappe2); // Assuming frappeObject is defined

// add a utility that 1- handles column and section breaks, 2- handles custom components.
const FormComponent: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        console.log(data);
    };

    useEffect(() => {
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {fieldConfigurations.map((field, index) => (
                <Controller
                    key={index}
                    name={field.fieldname}
                    control={control}
                    // rules={[]} add validation rules here
                    defaultValue={field.default || ''}
                    render={({ field: controllerField }) => {
                        const Component = getComponent(field.fieldtype);
                        return <Component field={controllerField} config={field} />;
                    }}
                />
            ))}
            <button type="submit" className="btn">Submit</button>
        </form>
    );
};

export default FormComponent;


