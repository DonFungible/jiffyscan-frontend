import { tokenBalance } from '@/components/common/apiCalls/jiffyApis';
import Chip, { ChipProps } from '@/components/common/chip/Chip';
import { NETWORK_SCANNER_MAP, POWERED_BY_LOGO_MAP } from '@/components/common/constants';
import CopyButton from '@/components/common/copy_button/CopyButton';
import DisplayFee from '@/components/common/displayfee/DisplayFee';
import IconText from '@/components/common/IconText';
import Caption from '@/components/common/Caption';
import { getFee, getTimePassed, shortenString } from '@/components/common/utils';
import { Link, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/router';

import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton-2';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
export default function TransactionDetails({ item, network, addressMapping, tableLoading, tokenBalances }: any) {
    console.log('🚀 ~ file: TransactionDetails.tsx:11 ~ TransactionDetails ~ item:', item);
    const [tableLoading1, setTableLoading1] = useState(true);
    const [selectValue, setSelectValue] = useState(0 as number);
    const [totalBalance, setTotalBalance] = useState(0 as number);

    const calculateTotalBalance = (tokenBalances: tokenBalance[]) => {
        let total = 0;
        tokenBalances.forEach((tokenBalance) => {
            total += tokenBalance.quote;
        });
        setTotalBalance(total);
    };

    useEffect(() => {
        setTableLoading1(true);
        if (network) {
            setTimeout(() => {
                setTableLoading1(false);
            }, 1000);
        }
    }, [network]);

    useEffect(() => {
        calculateTotalBalance(tokenBalances);
    });

    let skeletonCards = Array(3).fill(0);
    const router = useRouter();

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleSelect = (index: number) => {
        setSelectedTokenIndex(index);
        setDropdownOpen(false);
    };
    return (
        <div>
            <section className=" px-3">
                <div className="container px-0">
                    {/* <div>
                        <Caption icon={'/images/cube.svg'} text={''}>
                            Account Details
                        </Caption>
                    </div> */}
                    <div className="bg-white rounded mb-[20px] container px-0 font-gsans space-y-6 dark:bg-[#1F202B]">
                        {tableLoading ? (
                            skeletonCards.map((index: number) => <Skeleton height={55} key={index} />)
                        ) : (
                            <div>
                                <section className="">
                                    <div className="container rounded  px-0 ">
                                        <div className="flex md:flex-row flex-col items-center  border-[#ccc] border-0 md:gap-[20px] gap-[10px]  pb-[2px]">
                                            <div className="md:w-[280px] px-[16px] py-[8px] flex items-center gap-2">
                                                <IconText icon={'/images/sader.svg'}>
                                                    <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                        DEPLOYMENT DATE
                                                    </span>
                                                </IconText>
                                            </div>
                                            <div className=" break-words gap-2 flex-1">
                                                {item?.userOpHash ? (
                                                    <div className="md:flex block justify-between">
                                                        <div className="flex items-center gap-[10px]">
                                                            <Link
                                                                underline="hover"
                                                                // color="text.primary"
                                                                href={
                                                                    '/userOpHash/' +
                                                                    item?.userOpHash +
                                                                    (network ? '/?network=' + network : '')
                                                                }
                                                                aria-current="page"
                                                                className="text-blue-200"
                                                            >
                                                                <span className="text-[#1976D2] md:text-[14px] text-[16px] break-all leading-5">
                                                                    {getTimePassed(item?.blockTime)}
                                                                </span>
                                                            </Link>
                                                            <div className="w-[30px] flex">
                                                                <CopyButton text={item?.address} />
                                                            </div>
                                                            <Link
                                                                underline="hover"
                                                                // color="text.primary"
                                                                href={
                                                                    '/userOpHash/' +
                                                                    item?.userOpHash +
                                                                    (network ? '/?network=' + network : '')
                                                                }
                                                                aria-current="page"
                                                                className="text-blue-200 "
                                                                target={'_blank'}
                                                            >
                                                                <button className="outline-none md:block hidden focus:outline-none ring-0 focus:ring-0">
                                                                    <img src="/images/share.svg" alt="" />
                                                                    {/* </Link> */}
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="md:flex block justify-between">
                                                        <div className="flex items-center gap-[10px]">
                                                            <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                                Possibly not a 4337 compliant wallet.
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center md:pt-[0px] pt-[16px]   border-[#ccc] border-0 md:gap-[20px] gap-[10px]  pb-[2px]">
                                            <div className="md:w-[280px] px-[16px] py-[8px] flex items-center gap-2">
                                                <IconText icon={'/images/sader.svg'}>
                                                    <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                        FACTORY
                                                    </span>
                                                </IconText>
                                            </div>
                                            <div className=" break-words gap-2 flex-1">
                                                {item?.userOpHash ? (
                                                    <div className="md:flex block justify-between">
                                                        <div className="flex items-center gap-[10px]">
                                                            <Link
                                                                underline="hover"
                                                                // color="text.primary"
                                                                href={'/factory/' + item?.factory + (network ? '/?network=' + network : '')}
                                                                aria-current="page"
                                                                className="text-blue-200"
                                                            >
                                                                <span className="text-[#1976D2] md:text-[14px] text-[16px] break-all leading-5">
                                                                    {item.factory}
                                                                </span>
                                                            </Link>
                                                            <div className="w-[30px] flex">
                                                                <CopyButton text={item?.factory} />
                                                            </div>
                                                            <Link
                                                                underline="hover"
                                                                // color="text.primary"
                                                                href={'/factory/' + item?.factory + (network ? '/?network=' + network : '')}
                                                                aria-current="page"
                                                                className="text-blue-200 "
                                                                target={'_blank'}
                                                            >
                                                                <button className="outline-none md:block hidden focus:outline-none ring-0 focus:ring-0">
                                                                    <img src="/images/share.svg" alt="" />
                                                                    {/* </Link> */}
                                                                </button>
                                                            </Link>
                                                        </div>
                                                        {item?.factory === '' ? null : (
                                                            <div className="md:px-[16px] px-0 md:py-[8px] py-0">
                                                                <p className="text-[10px] text-[#455A64]">
                                                                    {addressMapping?.[item?.factory?.toLowerCase()] &&
                                                                        POWERED_BY_LOGO_MAP?.[
                                                                            addressMapping?.[
                                                                                item?.factory?.toLowerCase()
                                                                            ]?.company.toLowerCase()
                                                                        ] && (
                                                                            <span className="text-bluegrey-300 text-[10px] leading-5 flex items-center gap-2 font-normal">
                                                                                Power by{' '}
                                                                                <img
                                                                                    src={
                                                                                        POWERED_BY_LOGO_MAP?.[
                                                                                            addressMapping?.[
                                                                                                item?.factory?.toLowerCase()
                                                                                            ]?.company.toLowerCase()
                                                                                        ]?.small
                                                                                    }
                                                                                    style={{ height: 20, width: 20 }}
                                                                                    alt=""
                                                                                />
                                                                            </span>
                                                                        )}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="md:flex block justify-between">
                                                        <div className="flex items-center gap-[10px]">
                                                            <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                                Possibly not a 4337 compliant wallet.
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex md:pt-[0px] pt-[16px] items-center border-[#ccc] border-0 md:gap-[20px] gap-[10px]  pb-[2px]">
                                            <div className="md:w-[280px] px-[16px] py-[8px] flex items-center gap-2">
                                                <IconText icon={'/images/sader.svg'}>
                                                    <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                        TOTAL DEPOSIT
                                                    </span>
                                                </IconText>
                                            </div>
                                            <div className=" break-words gap-2 flex-1">
                                                <div className="md:flex block justify-between">
                                                    <div className="flex items-center gap-[10px]">
                                                        <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                            <DisplayFee
                                                                item={item?.totalDeposit ? item?.totalDeposit : '0'}
                                                                network={network}
                                                            />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {totalBalance > -1 && (
                                            <div className="flex md:pt-[0px] pt-[16px] items-center  border-[#ccc] border-0 md:gap-[20px] gap-[10px]  pb-[2px]">
                                                <div className="md:w-[280px] px-[16px] py-[8px] flex items-center gap-2">
                                                    <IconText icon={'/images/sader.svg'}>
                                                        <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                            TOTAL BALANCE
                                                        </span>
                                                    </IconText>
                                                </div>
                                                <div className=" break-words gap-2 flex-1">
                                                    <div className="md:flex block justify-between">
                                                        <div className="flex items-center gap-[10px]">
                                                            <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                                {`$${totalBalance.toFixed(2)}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {tokenBalances?.length > 0 && (
                                            <div className="flex md:pt-[0px] pt-[16px] items-center border-[#ccc] border-0 md:gap-[20px] gap-[10px]  pb-[2px]">
                                                <div className="md:w-[280px] px-[16px]  flex items-center gap-2">
                                                    <IconText icon={'/images/sader.svg'}>
                                                        <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                            ERC20 BALANCES
                                                        </span>
                                                    </IconText>
                                                </div>
                                                <div className="break-words gap-2 flex-1">
                                                    <div className="md:flex block justify-between">
                                                        <div className="flex items-center gap-[10px]">
                                                            <span className="text-base text-[#646D8F] dark:text-[#ADB0BC] font-gsans font-normal leading-5">
                                                                {/* Display selected token balance */}
                                                                <div className="relative ">
                                                                    <div
                                                                        className="cursor-pointer flex justify-between items-center dark:border-gray-600 p-2 rounded-md "
                                                                        onClick={toggleDropdown}
                                                                    >
                                                                        <span>
                                                                            {tokenBalances[selectedTokenIndex].contract_name}:{' '}
                                                                            {(
                                                                                parseInt(tokenBalances[selectedTokenIndex].balance) /
                                                                                10 ** tokenBalances[selectedTokenIndex].contract_decimals
                                                                            ).toFixed(4)}
                                                                            ($
                                                                            {(
                                                                                (tokenBalances[selectedTokenIndex].quote_rate *
                                                                                    parseInt(tokenBalances[selectedTokenIndex].balance)) /
                                                                                10 ** tokenBalances[selectedTokenIndex].contract_decimals
                                                                            ).toFixed()}
                                                                            )
                                                                            
                                                                        </span>
                                                                        {!isDropdownOpen && tokenBalances.length > 1? (
                                                                            <button className="ml-2 flex rounded-full border px-2 py-1">
                                                                                <MdArrowDropDown />
                                                                                {tokenBalances.length - 1} more
                                                                            </button>
                                                                        ):(
                                                                            <button className="ml-2 flex rounded-full border px-2 py-1">
                                                                                <MdArrowDropUp />
                                                                                {tokenBalances.length - 1} more
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    {/* Dropdown content */}
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute z-10 mt-1 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                                                                            {tokenBalances.map(
                                                                                (
                                                                                    token: {
                                                                                        contract_name:
                                                                                            | string
                                                                                            | number
                                                                                            | boolean
                                                                                            | React.ReactElement<
                                                                                                  any,
                                                                                                  string | React.JSXElementConstructor<any>
                                                                                              >
                                                                                            | React.ReactFragment
                                                                                            | React.ReactPortal
                                                                                            | null
                                                                                            | undefined;
                                                                                        balance: string;
                                                                                        contract_decimals: number;
                                                                                        quote_rate: number;
                                                                                    },
                                                                                    index: number,
                                                                                ) => (
                                                                                    <div
                                                                                        key={index}
                                                                                        onClick={() => handleSelect(index)}
                                                                                        className="flex justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                                                    >
                                                                                        <span>{token.contract_name}</span>
                                                                                        <span>
                                                                                            {(
                                                                                                parseInt(token.balance) /
                                                                                                10 ** token.contract_decimals
                                                                                            ).toFixed(4)}
                                                                                            ($
                                                                                            {(
                                                                                                (token.quote_rate *
                                                                                                    parseInt(token.balance)) /
                                                                                                10 ** token.contract_decimals
                                                                                            ).toFixed()}
                                                                                            )
                                                                                        </span>
                                                                                    </div>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
