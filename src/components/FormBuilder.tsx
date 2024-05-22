import React from 'react';

// Define field configuration types
interface FieldConfig {
    name: string;
    label?: string;
    required: boolean;
    readOnly: boolean;
    options?: string[] | string; // options can be either an array or a string
    type: 'Text' | 'Number' | 'Email' | 'Date' | 'Select' | 'Checkbox' | 'TextArea';
}

// Interface for components that accept standardized configuration
interface ComponentProps {
    config: FieldConfig;
    [key: string]: any; // This allows passing additional props like `className`, etc.
}

interface CustomComponents {
    [key: string]: React.ComponentType<ComponentProps>;
}

interface ComponentMap {
    [key: string]: React.ComponentType<ComponentProps>;
}

// Function to prepare custom components, adding necessary logic for options handling, etc.
function PrepareComponent(components: ComponentMap): CustomComponents {
    const wrappedComponents: CustomComponents = {};
    Object.keys(components).forEach(key => {
        const OriginalComponent = components[key];
        wrappedComponents[key] = ({ config, ...props }) => {
            if (key === 'Select' && typeof config.options === 'string') {
                const optionsArray = config.options.split('\n').map(option => ({ value: option.trim(), label: option.trim() }));
                return <OriginalComponent {...config} {...props} options={optionsArray} />;
            }
            return <OriginalComponent {...config} {...props} />;
        };
    });
    return wrappedComponents;
}

// Define default components
const DefaultComponents: CustomComponents = {
    Text: (props: ComponentProps) => (
        <input type="text" {...props.config} className={`input input-bordered w-full max-w-xs ${props.className || ''}`} />
    ),
    Number: (props: ComponentProps) => (
        <input type="number" {...props.config} className={`input input-bordered w-full max-w-xs ${props.className || ''}`} />
    ),
    Email: (props: ComponentProps) => (
        <input type="email" {...props.config} className={`input input-bordered w-full max-w-xs ${props.className || ''}`} />
    ),
    Date: (props: ComponentProps) => (
        <input type="date" {...props.config} className={`input input-bordered w-full max-w-xs ${props.className || ''}`} />
    ),
    Select: (props: ComponentProps) => (
        <select {...props.config} className={`select select-bordered w-full max-w-xs ${props.className || ''}`}>
            {Array.isArray(props.config.options) ? props.config.options.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
            )) : null}
        </select>
    ),
    Checkbox: (props: ComponentProps) => (
        <input type="checkbox" {...props.config} className={`checkbox checkbox-primary ${props.className || ''}`} />
    ),
    TextArea: (props: ComponentProps) => (
        <textarea {...props.config} className={`textarea textarea-bordered h-24 w-full ${props.className || ''}`} />
    )
};

// Example custom components provided by the user
const userComponents = {
    Text: (props: ComponentProps) => <input type="text" className="input" {...props.config} {...props} />,
    Select: (props: ComponentProps) => <select className="select" {...props.config} {...props} />
};

const CustomComponents = PrepareComponent(userComponents);

// React component renderer
const ReactFieldRenderer = ({ config, customComponents = CustomComponents }: { config: FieldConfig; customComponents?: CustomComponents }): React.ReactElement | null => {
    const Component = customComponents[config.type] || DefaultComponents[config.type];
    return <Component config={config} />;
};

// Mock field configurations for testing
const fields: FieldConfig[] = [
    { name: 'username', type: 'Text', label: 'Username', required: true, readOnly: false },
    { name: 'country', type: 'Select', options: 'USA\nCanada\nMexico', required: true },
    { name: 'agreement', type: 'Checkbox', label: 'Agree to terms', required: true },
    { name: 'bio', type: 'TextArea', label: 'Biography', required: false }
];

// Form component using the field renderer
const FormComponent: React.FC = () => {
    const formElements = fields.map(field => <ReactFieldRenderer config={field} />);
    return (
        <form>
            {formElements}
            <button className="btn">Submit</button>
        </form>
    );
};

export default FormComponent;
