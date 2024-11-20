import React from 'react';

export default function Status({ type, status, ago }: { type?: boolean; status?: string; ago?: string }) {
    return (
        <div>
            {type === true && (
                <span className="flex items-center  px-3 py-px  gap-2 rounded-full border border-[#4CAF50]">
                    <img src="/images/Success.svg" alt="" />
                    <span className="font-normal text-[12px] leading-5 text-dark-600">Success</span>
                </span>
            )}
            {type === false && (status == 'failed' || status == 'FAILED') && (
                <span className="flex items-center  px-3 py-px  gap-2 rounded-full border border-[#d81a14]">
                    <img src="/images/failed.svg" alt="" />
                    <span className="font-normal text-[12px] leading-5 text-dark-600">Failed</span>
                </span>
            )}
            {status === 'pending' && (
                <span className="flex items-center  px-3 py-px  gap-2 rounded-full border border-[#d81a14]">
                    <img src="/images/pending.svg" alt="" />
                    <span className="font-normal text-[12px] leading-5 text-dark-600">Failed</span>
                </span>
            )}
            {status === 'IN_BUNDLER_MEMPOOL' && (
                <span className="flex items-center px-3 py-[0.3rem] w-[150px]   gap-2 rounded-full border border-[#FB8C00]">
                    <img src="/images/pending.svg" alt="" />
                    <span className="font-normal text-[12px] leading-5 text-dark-600">In Alt Mempool</span>
                </span>
            )}
            {status === 'IN_EVM_MEMPOOL' && (
                <span className="flex items-center px-3 py-[0.3rem] w-[150px]  gap-2 rounded-full border border-[#FB8C00]">
                    <img src="/images/pending.svg" alt="" />
                    <span className="font-normal text-[12px] leading-5 text-dark-600">In Main Mempool</span>
                </span>
            )}
            {status === 'success' && (
                <span className="flex justify-center items-center gap-2 rounded-full">
                    <img src="/images/Success.svg" alt="" /> <span className="tracking-normal whitespace-nowrap">{ago}</span>
                </span>
            )}
            {status === 'failure' && (
                <span className="flex justify-center items-center gap-2 rounded-full">
                    <img src="/images/failed.svg" alt="" /> <span className="tracking-normal whitespace-nowrap">{ago}</span>
                </span>
            )}
        </div>
    );
}
