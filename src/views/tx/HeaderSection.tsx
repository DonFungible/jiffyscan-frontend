import { NETWORK_ICON_MAP, NETWORK_LIST, NETWORK_SCANNER_MAP } from '@/components/common/constants';
import CopyButton from '@/components/common/copy_button/CopyButton';
import { getExplorerLogo } from '@/components/common/utils';
import Link from 'next/link';
import React from 'react';

export default function HeaderSection({ item, network, block }: any) {
    return (
        <div>
            <section className={`${block && "blur"} px-3 `}>
                <div className="container  bg-white rounded shadow-200 px-[16px] py-[12px]">
                    <h3 className="text-[15px]  leading-[28px] font-bold text-dark-600">Bundle</h3>
                    <div className="md:flex items-center gap-4 pt-[14px] pb-[2px]">
                        <div className="flex items-center gap-2">
                            <img src={NETWORK_ICON_MAP[network as string]} alt="" className="h-[20px]" />
                            <span className="text-sm font-normal leading-5 text-dark-600">
                                {NETWORK_LIST.find((el) => el.key === network)?.name}
                            </span>
                        </div>
                        <div className="flex items-center flex-1 gap-2 break-words">
                            <span className="text-sm leading-5 break-all text-dark-600">{item?.transactionHash}</span>
                            <CopyButton text={item?.transactionHash} />
                            <button className="outline-none focus:outline-none ring-0 focus:ring-0">
                                <Link
                                    // underline="hover"
                                    // color="text.primary"
                                    href={`${NETWORK_SCANNER_MAP[network]}/tx/${item?.transactionHash}`}
                                    aria-current="page"
                                    className="text-blue-200"
                                    target="_blank"
                                >
                                    <img src={getExplorerLogo(network)} style={{height: '16px', width: '16px'}} alt="" />
                                </Link>
                            </button>
                        </div>
                        {/* <span className="text-bluegrey-300 text-[10px] leading-5 flex items-center gap-2 font-normal">
                                                Powered By <img src="/images/pimlico.svg" alt="" />
                                            </span> */}
                    </div>
                </div>
            </section>
        </div>
    );
}
