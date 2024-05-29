'use client'
import IntegratedForm from '../components/Integrated.client';
import { DefaultComponents } from '../components/ComponentMap';
import {frappe2} from '../components/frappe2';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <IntegratedForm componentMap={DefaultComponents} frappeObject={frappe2} />
      </div>
    </main>
  );
}
