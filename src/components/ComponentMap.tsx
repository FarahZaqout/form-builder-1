import React from 'react';
import { CustomComponents } from './Types';

export const DefaultComponents: CustomComponents = {
    Text: ({ field, config }) => (
        <input type="text" {...field} placeholder={config.label} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Number: ({ field, config }) => (
        <input type="number" {...field} placeholder={config.label} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Email: ({ field, config }) => (
        <input type="email" {...field} placeholder={config.label} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Select: ({ field, config }) => (
        <select {...field} required={Boolean(config.reqd)} disabled={Boolean(config.read_only)} className="select select-bordered w-full max-w-xs">
            {config.options?.split('\n').map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    ),
    Checkbox: ({ field, config }) => (
        <label className="label cursor-pointer">
            <input type="checkbox" {...field} className="checkbox checkbox-primary" />
            <span className="label-text ml-2">{config.label}</span>
        </label>
    ),
    FileUpload: ({ field, config }) => (
        <input type="file" {...field} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Date: ({ field, config }) => (
        <input type="date" {...field} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    )
};
