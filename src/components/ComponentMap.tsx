import React from 'react';
import { CustomComponents } from '../Types';

export const DefaultComponents: CustomComponents = {
    'text': ({ field, config }) => (
        <input type="text" {...field} {...config} className="input input-bordered w-full max-w-xs" />
    ),
    'number': ({ field, config }) => (
        <input type="number" {...field} {...config} className="input input-bordered w-full max-w-xs" />
    ),
    'email': ({ field, config }) => (
        <input type="email" {...field} {...config} className="input input-bordered w-full max-w-xs" />
    ),
    'select': ({ field, config }) => (
        <select {...field} {...config} className="select select-bordered w-full max-w-xs">
            {config.options?.split('\n').map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    ),
    'checkbox': ({ field, config }) => (
        <label className="label cursor-pointer">
            <input type="checkbox" {...field} {...config} className="checkbox checkbox-primary" />
            <span className="label-text ml-2">{config.label}</span>
        </label>
    ),
    'fileupload': ({ field, config }) => (
        <input {...field} {...config} className="input input-bordered w-full max-w-xs" />
    ),
    'date': ({ field, config }) => (
        <input type="date" {...field} {...config} className="input input-bordered w-full max-w-xs" />
    ),
    'text editor': ({ field, config }) => (
        <label>
            <span className="label-text">{config.label}</span>
            <textarea {...field} {...config} className="input input-bordered w-full max-w-xs" />
        </label>
    ),
    'phone': ({ field, config }) => (
        <input type="tel" {...field} {...config}  className="input input-bordered w-full max-w-xs" />
    ),
    'currency': ({ field, config }) => (
        <input type="number" step="0.01" {...field} {...config}  className="input input-bordered w-full max-w-xs" />
    ),
    'datetime': ({ field, config }) => (
        <input type="datetime-local" {...field} {...config} className="input input-bordered w-full max-w-xs" />
    ),
    'attach': ({ field, config }) => (
        <input type="file" {...field} {...config} className="input input-bordered w-full max-w-xs" />
    ),
    'attach image': ({ field, config }) => (
        <input type="file" accept="image/*" {...field} {...config} className="input input-bordered w-full max-w-xs" />
    ),
    'float': ({ field, config }) => (
        <input type="number" step="any" {...field} {...config}  className="input input-bordered w-full max-w-xs" />
    ),
    'integer': ({ field, config }) => (
        <input type="number" {...field} {...config}  className="input input-bordered w-full max-w-xs" />
    ),
    'password': ({ field, config }) => (
        <input type="password" {...field} {...config}  className="input input-bordered w-full max-w-xs" />
    ),
    'percent': ({ field, config }) => (
        <input type="number" {...field} {...config}  className="input input-bordered w-full max-w-xs" />
    )
};
