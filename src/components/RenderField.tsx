import React from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { ExtendedField, CustomComponents } from '../Types';
import { FIELD_TYPES } from './constants';
import { getComponent } from './FormHelpers';

interface RenderFieldProps {
    field: ExtendedField;
    control: any;
    errors: any;
    index: number;
    componentMap: CustomComponents;
}

export const RenderField: React.FC<RenderFieldProps> = ({ field, control, errors, index }) => {
    // Skip rendering for non-interactive field types such as 'Column Break' and 'Section Break'
    if (field.fieldtype.toLowerCase() === FIELD_TYPES.COLUMN_BREAK || field.fieldtype.toLowerCase() === FIELD_TYPES.SECTION_BREAK) {
        return null;
    }
    const Component = getComponent(field.fieldtype);

    return (
        <Controller
            key={index}
            name={field.fieldname}
            control={control}
            defaultValue={field.default || ''}
            render={({ field: controllerField }: { field: ControllerRenderProps }) => (
                <>
                    {!Boolean(field.hidden) && <div>
                        <Component field={controllerField} config={field} />
                        {errors[field.fieldname] && <span className="text-red-500">{errors[field.fieldname].message}</span>}
                    </div>}
                </>
            )}
        />
    );
};
