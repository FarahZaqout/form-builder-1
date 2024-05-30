import React from 'react';
import { CustomComponents } from './Types';

export const DefaultComponents: CustomComponents = {
    'text': ({ field, config }) => (
        <input type="text" {...field} hidden={Boolean(config.hidden)} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'number': ({ field, config }) => (
        <input type="number" {...field} hidden={Boolean(config.hidden)} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'email': ({ field, config }) => (
        <input type="email" {...field} hidden={Boolean(config.hidden)} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'select': ({ field, config }) => (
        <select {...field} hidden={Boolean(config.hidden)} required={Boolean(config.reqd)} disabled={Boolean(config.read_only)} className="select select-bordered w-full max-w-xs">
            {config.options?.split('\n').map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    ),
    'checkbox': ({ field, config }) => (
        <label hidden={Boolean(config.hidden)} className="label cursor-pointer">
            <input type="checkbox" {...field} className="checkbox checkbox-primary" disabled={Boolean(config.read_only)} />
            <span className="label-text ml-2">{config.label}</span>
        </label>
    ),
    'fileupload': ({ field, config }) => (
        <input hidden={Boolean(config.hidden)} type="file" {...field} required={Boolean(config.reqd)} disabled={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'date': ({ field, config }) => (
        <input hidden={Boolean(config.hidden)} type="date" {...field} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'text editor': ({ field, config }) => (
        <label>
            <span hidden={Boolean(config.hidden)} className="label-text">{config.label}</span>
            <textarea {...field} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
        </label>
    ),
    'phone': ({ field, config }) => (
        <input type="tel" {...field} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'currency': ({ field, config }) => (
        <input type="number" step="0.01" {...field} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'datetime': ({ field, config }) => (
        <input type="datetime-local" {...field} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'attach': ({ field, config }) => (
        <input type="file" {...field} required={Boolean(config.reqd)} disabled={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'attach image': ({ field, config }) => (
        <input type="file" accept="image/*" {...field} required={Boolean(config.reqd)} disabled={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'float': ({ field, config }) => (
        <input type="number" step="any" {...field} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'integer': ({ field, config }) => (
        <input type="number" {...field} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'password': ({ field, config }) => (
        <input type="password" {...field} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    'percent': ({ field, config }) => (
        <input type="number" {...field} placeholder={config.label || config.fieldname} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    )
};
