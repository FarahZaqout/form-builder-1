export function createFieldConfig(simplifiedFields: any) {
    const defaultConfig = {
        type: 'text',  // default type for simplicity
        required: false,
        readOnly: false,
        options: []  // mainly for selects or radio buttons
    };

    const fieldConfigurations = {};

    simplifiedFields.forEach((field: any) => {
        const options = field.options ? field.options.split('\n').map((opt: string) => opt.trim()) : [];
        
        const fieldConfig = {
            ...defaultConfig,
            ...field,
            options: options
        };
        // @ts-ignore
        fieldConfigurations[field.name] = fieldConfig;
    });

    return fieldConfigurations;
}


// use: renderForm(config, reactRenderer);
// @ts-ignore
export function renderForm(fieldsConfig, renderFunction) {
    return Object.keys(fieldsConfig).map(fieldName => {
        return renderFunction({ config: fieldsConfig[fieldName] });
    });
}


// Simplified fields (assuming this data comes from `simplifyJSON` output)
export const simplifiedFields = [
    {
        name: "status",
        label: "Status",
        fieldtype: "Select",
        options: "Synced, In Process, Failed",
        default: "Synced",
        required: true,
        readOnly: false,
        placeholder: "Select status"
    },
    {
        name: "meta_title",
        label: "Meta Title",
        fieldtype: "Data",
        default: "Page Title",
        required: true,
        readOnly: false,
        placeholder: "Enter meta title",
    }
];


export const fieldConfigurations = createFieldConfig(simplifiedFields);


import React from 'react';

interface FieldConfig {
    name: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    type?: string; // Optional to handle default inputs
    fieldtype: 'Select' | 'Checkbox' | 'Radio' | 'Date' | 'Text';
}

interface CustomComponents {
    [key: string]: React.ComponentType<{ config: FieldConfig }>;
}

const DefaultComponents: CustomComponents = {
    Select: ({ config }: { config: FieldConfig }) => (
        <select name={config.name} required={config.required}>
            {config.options?.map((option, index) => <option key={index} value={option}>{option}</option>)}
        </select>
    ),
    Checkbox: ({ config }: { config: FieldConfig }) => (
        <div>
            {config.options?.map((option, index) => (
                <label key={index}>
                    <input type="checkbox" name={config.name} value={option} required={config.required} /> {option}
                </label>
            ))}
        </div>
    ),
    Radio: ({ config }: { config: FieldConfig }) => (
        <div>
            {config.options?.map((option, index) => (
                <label key={index}>
                    <input type="radio" name={config.name} value={option} required={config.required} /> {option}
                </label>
            ))}
        </div>
    ),
    Date: ({ config }: { config: FieldConfig }) => (
        <input type="date" name={config.name} required={config.required} />
    ),
    Text: ({ config }: { config: FieldConfig }) => (
        <input type="text" name={config.name} placeholder={config.placeholder} required={config.required} />
    )
};


interface CustomFieldProps {
    config: FieldConfig;
}

const DataInput: React.FC<CustomFieldProps> = ({ config }) => (
    <input
        type="text"
        className="input input-bordered w-full max-w-xs"
    />
);

const AttachInput: React.FC<CustomFieldProps> = ({ config }) => (
    <input
        type="file"
        name={config.name}
        className="input input-bordered w-full max-w-xs"
    />
);

const LongTextInput: React.FC<CustomFieldProps> = ({ config }) => (
    <textarea
        name={config.name}
        className="textarea textarea-bordered h-24"
    />
);

export const TailwindComponents = {
    Data: DataInput,
    Attach: AttachInput,
    "Long Text": LongTextInput
};


const ReactFieldRenderer: React.FC<{ config: FieldConfig; customComponents?: CustomComponents }> = ({ config, customComponents = {} }) => {
    console.log({config});
    const Component = customComponents[config.fieldtype] || DefaultComponents[config.fieldtype] || DefaultComponents.Text;

    return <Component config={config} />;
};

export default ReactFieldRenderer;
