import { propertiesSignal } from '@/store/signals'
import { useSignalEffect } from '@preact/signals-react';
import React, { useState } from 'react'

const Properties: React.FC = () => {
    const [properties, setProperties] = useState(propertiesSignal.value);

    useSignalEffect(() => {
        setProperties(propertiesSignal.value);
    })

    return (
        <div className="w-[20%] h-full bg-gray-200 border-l-2 border-gray-300">
            <div className='text-center text-2xl py-2 border-b border-gray-300'>Properties</div>

            <div className="">
                <div className="grid grid-cols-2 gap-10 p-4">
                    <div className='flex justify-between p-4 bg-slate-300'><strong>X:</strong> {properties?.x ?? 'N/A'}</div>
                    <div className='flex justify-between p-4 bg-slate-300'><strong>Y:</strong> {properties?.y ?? 'N/A'}</div>
                    <div className='flex justify-between p-4 bg-slate-300'><strong>Width:</strong> {properties?.width ?? 'N/A'}</div>
                    <div className='flex justify-between p-4 bg-slate-300'><strong>Height:</strong> {properties?.height ?? 'N/A'}</div>
                </div>
            </div>
        </div>
    )
}

export default Properties