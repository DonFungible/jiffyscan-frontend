import Footer from '@/components/global/footer/Footer';
import Navbar from '@/components/global/navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { UserOp, Bundle, getBundlerDetails, fetchNetworkData, NetworkResponse } from '@/components/common/apiCalls/jiffyApis';
import { Breadcrumbs, IconButton, Link, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import { getFee, getTimePassed, shortenString } from '@/components/common/utils';
import { NETWORK_ICON_MAP, NETWORK_LIST } from '@/components/common/constants';
import Table, { tableDataT } from '@/components/common/table/Table';
import Pagination from '@/components/common/table/Pagination';
import HeaderSection from './HeaderSection';
import HeaderSectionGlobal from '@/components/global/HeaderSection';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useConfig } from '@/context/config';
import { useUserSession } from '@/context/userSession';
import Chip from '@/components/common/chip/Chip';
import { SlHome } from 'react-icons/sl';
import { MdContentCopy } from 'react-icons/md';
export const BUTTON_LIST = [
    {
        name: 'Default View',
        key: 'Default View',
    },
    {
        name: 'Original',
        key: 'Original',
    },
];
interface NetworkItem {
    name: string;
    key: string;
    iconPath: string;
    iconPathInverted: string;
}


const DEFAULT_PAGE_SIZE = 10;

const columns = [
    { name: 'UserOp Hash', sort: true },
    { name: 'Age', sort: true },
    { name: 'Sender', sort: false },
    { name: 'Target', sort: false },
    { name: 'Fee', sort: true },
];
const createUserOpsTableRows = (userOps: UserOp[]): tableDataT['rows'] => {
    let newRows = [] as tableDataT['rows'];
    if (!userOps) return newRows;
    userOps.forEach((userOp) => {
        newRows.push({
            token: {
                text: userOp.userOpHash,
                icon: NETWORK_ICON_MAP[userOp.network],
                type: 'userOp',
            },
            ago: getTimePassed(userOp.blockTime!),
            sender: userOp.sender,
            target: userOp.target!,
            fee: getFee(userOp.actualGasCost, userOp.network as string),
            status: userOp.success!,
        });
    });
    return newRows;
};

interface AccountInfo {
    userOpsLength: number;
    address: string;
}


const createAccountInfoObject = (bundleDetails: Bundle): AccountInfo => {
    return {
        userOpsLength: bundleDetails.userOpsLength,
        address: bundleDetails.address,
    };
};

function Bundler(props: any) {
    const router = useRouter();
    const [tableLoading, setTableLoading] = useState(true);
    const { addressMapping } = useConfig();
    const hash = props.slug && props.slug[0];
    const network = router.query && (router.query.network as string);
    const [rows, setRows] = useState([] as tableDataT['rows']);
    const [addressInfo, setAddressInfo] = useState<AccountInfo>();
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, _setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [captionText, setCaptionText] = useState('N/A User Ops found');

    const [displayNetworkList, setDisplayNetworkList] = useState<NetworkItem[]>([]);
    const [networkListReady, setNetworkListReady] = useState(false)
    const [copyTooltip, setCopyTooltip] = useState('Copy'); // Tooltip state for copy action

    const handleCopy = () => {
        navigator.clipboard.writeText(hash); // Copy the hash to clipboard
        setCopyTooltip('Copied!'); // Change tooltip to indicate success
        setTimeout(() => setCopyTooltip('Copy'), 1500); // Reset tooltip after 1.5s
    };
    // handling table page change. Everytime the pageNo change, or pageSize change this function will fetch new data and update it.
    const updateRowsData = async (network: string, pageNo: number, pageSize: number) => {
        setTableLoading(true);
        if (addressInfo == undefined) {
            return;
        }
        const addressDetail = await getBundlerDetails(addressInfo.address, network ? network : '', pageNo, pageSize, toast);
        const rows = createUserOpsTableRows(addressDetail.userOps);
        setRows(rows);
        setTableLoading(false);
    };

    const checkTermInNetworks = React.useCallback(async (term: string) => {
        const networksWithTerm: string[] = [];
        const networkKeys = Object.keys(NETWORK_LIST);

        try {
            const data: NetworkResponse[] = await fetchNetworkData(term);

            data.forEach((networkData: NetworkResponse, index: number) => {
              if (!networkData.message) {
                const networkValue = networkKeys[index];
                networksWithTerm.push(networkValue);
              }
            });


            const validNetworksWithTerm = networksWithTerm.filter(
                (index) => typeof index === 'string' && !isNaN(Number(index)) && Number(index) < NETWORK_LIST.length
            );

            setDisplayNetworkList(
                validNetworksWithTerm.map((index) => NETWORK_LIST[Number(index)] as NetworkItem)
            );
            setNetworkListReady(true);
        } catch (error) {
            console.error('Error fetching data for networks:', error);
        }
    }, []);

    React.useEffect(() => {
        if (!networkListReady && hash) {
            checkTermInNetworks(hash);
        }
    }, [hash, networkListReady, checkTermInNetworks]);
    // update the page No after changing the pageSize
    const setPageSize = (size: number) => {
        _setPageSize(size);
        setPageNo(0);
    };

    // load the account details.
    const loadAccountDetails = async (name: string, network: string) => {
        setTableLoading(true);
        const addressDetail = await getBundlerDetails(name, network ? network : '', DEFAULT_PAGE_SIZE, pageNo, toast);
        const accountInfo = createAccountInfoObject(addressDetail);
        setAddressInfo(accountInfo);
    };

    useEffect(() => {
        updateRowsData(network ? network : '', pageSize, pageNo);
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('pageNo', (pageNo).toString());
        urlParams.set('pageSize', pageSize.toString());
        window.history.pushState(null, '', `${window.location.pathname}?${urlParams.toString()}`);
    }, [pageNo, addressInfo]);

    useEffect(() => {
        const captionText = `${addressInfo?.userOpsLength} User Ops found`;
        setCaptionText(captionText);
    }, [addressInfo]);

    let prevHash = hash;
    let prevNetwork = network;
    useEffect(() => {
        // Check if hash or network have changed
        if (prevHash !== undefined || prevNetwork !== undefined) {
            prevHash = hash;
            prevNetwork = network;
            loadAccountDetails(hash as string, network as string);
        }
    }, [hash, network]);
    let skeletonCards = Array(5).fill(0);
    return (
        <div className="dark:bg-[#191A23]">
            <Navbar searchbar />
            <section className="px-3 container mx-auto my-6 py-6 bg-white dark:bg-[#1F202B] shadow-lg rounded-xl border border-[#D7DAE0] dark:border-[#3B3C40]">
                <div className="container px-0">
                    <div className="flex flex-row">
                        <Link href="/" className="text-gray-500">
                            <ArrowBackIcon
                                style={{ height: '15px', width: '15px', marginRight: '20px', marginLeft: '10px', marginBottom: '3px' }}
                            />
                        </Link>
                        <Breadcrumbs aria-label="breadcrumb" className='font-gsans text-[#646D8F] text-md sm:text-base'>
                            <Link underline="hover" color="inherit" href={`/?network=${network ? network : ''}`}>
                            <SlHome />
                            </Link>
                            <Link underline="hover" color="inherit" href={`/bundler/${hash}?network=${network ? network : ''}`}>
                                Bundler
                            </Link>
                            <Link
                                underline="hover"
                                color="text.primary"
                                href={`/bundler/${hash}?network=${network ? network : ''}`}
                                aria-current="page"
                                className='text-[#195BDF]'
                            >
                                {shortenString(hash as string)}
                                <Tooltip title={copyTooltip}>
                                    <IconButton onClick={handleCopy} size="small" style={{ marginLeft: '8px' }}>
                                        <MdContentCopy className="w-4 h-4 dark:fill-[#ADB0BC]" />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        </Breadcrumbs>
                    </div>
                    {/* <h1 className="text-3xl font-bold">Bundler</h1> */}
                </div>
            
            {/* <HeaderSection item={addressInfo} network={network} addressMapping={addressMapping} displayNetworkList={displayNetworkList} /> */}
            {/* <HeaderSectionGlobal item={addressInfo} network={network} addressMapping={addressMapping} displayNetworkList={displayNetworkList} headerTitle="Bundler" /> */}
            <div className="container px-0 mt-[23px]">
                <Table
                    rows={rows}
                    columns={columns}
                    loading={tableLoading}
                    caption={{
                        children: captionText,
                        icon: '/images/cube.svg',
                        text: 'Approx Number of Operations Processed in the selected chain',
                    }}
                />
                <Pagination
                    pageDetails={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                        totalRows: addressInfo?.userOpsLength != null ? addressInfo.userOpsLength : 0,
                    }}
                />
            </div>
            </section>
            <ToastContainer />
            <Footer />
        </div>
    );
}

export default Bundler;
