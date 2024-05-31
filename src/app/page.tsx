'use client'
import IntegratedForm from '../components/Form';
import { DefaultComponents } from '../components/ComponentMap';
import {frappe2} from '../mockObjects/todo';
import {testDoc} from '../mockObjects/testDoc';
import {kurwa} from '../mockObjects/kurwa';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <IntegratedForm componentMap={DefaultComponents} frappeObject={kurwa} />
      </div>
    </main>
  );
}
