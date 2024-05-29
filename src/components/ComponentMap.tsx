import React from 'react';
import { CustomComponents } from './Types';

export const DefaultComponents: CustomComponents = {
    Text: ({ field, config }) => (
        <input type="text" {...field} hidden={Boolean(config.hidden)} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Number: ({ field, config }) => (
        <input type="number" {...field} hidden={Boolean(config.hidden)} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Email: ({ field, config }) => (
        <input type="email" {...field} hidden={Boolean(config.hidden)} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Select: ({ field, config }) => (
        <select {...field} hidden={Boolean(config.hidden)} required={Boolean(config.reqd)} disabled={Boolean(config.read_only)} className="select select-bordered w-full max-w-xs">
            {config.options?.split('\n').map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    ),
    Checkbox: ({ field, config }) => (
        <label hidden={Boolean(config.hidden)} className="label cursor-pointer">
            <input type="checkbox" {...field} className="checkbox checkbox-primary" disabled={Boolean(config.read_only)} />
            <span className="label-text ml-2">{config.label}</span>
        </label>
    ),
    FileUpload: ({ field, config }) => (
        <input hidden={Boolean(config.hidden)} type="file" {...field} required={Boolean(config.reqd)} disabled={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Date: ({ field, config }) => (
        <input hidden={Boolean(config.hidden)} type="date" {...field} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'Text Editor': ({ field, config }) => (
        <label>
            <span hidden={Boolean(config.hidden)} className="label-text">{config.label}</span>
            <textarea {...field} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
        </label>
    )
};
