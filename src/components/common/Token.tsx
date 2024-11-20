import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import CopyButton from './copy_button/CopyButton';
import { useConfig } from '@/context/config';
import { shortenString } from './utils';
import { NETWORK_SCANNER_MAP } from './constants';
import TextVisibleButton from '@/components/common/textVisiblebutton/textVisibleButton';
import { useNameService } from '@/context/nameServiceContext';

export interface TokenType {
    icon?: string;
    text: string;
    copyIcon?: string;
    type?: string;
    onTokenClicked?: (value: number) => void;
    value?: number;
    eyes?: boolean;
}

const resolveFor = ['factory', 'tx', 'address', 'bundler', 'paymaster'];

// const bns = new BNS({
//     rpcEndpoint: 'https://mainnet.base.org'
// });

function Token({ icon, text, copyIcon, type, onTokenClicked, value, eyes }: TokenType) {
    const { selectedNetwork } = useConfig();
    const [showText, setShowText] = useState(false);
    const [resolvedAddress, setResolvedAddress] = useState('');
    const { getName } = useNameService();

    useEffect(() => {
        const resolveAddress = async () => {
            if (resolveFor.includes(type ? type : '')) {
                const name = await getName(text);
                setResolvedAddress(name);
            }
        };
        resolveAddress();
    });

    if (text == 'Unavailable!') return <div className="flex items-center gap-2.5">{text}</div>;
    const renderString = showText ? text : shortenString(text, eyes);

    return (
        <div className="flex items-center justify-center gap-2.5">
            {icon && <img src={icon} alt="" style={{ width: '20px', height: '20px' }} />}
            {onTokenClicked ? (
                <a onClick={() => onTokenClicked(value ? value : 0)} className="text-blue-200 cursor-pointer">
                    {resolvedAddress ? resolvedAddress : renderString}
                </a>
            ) : (
                <Link href={getHrefLink(type, text, selectedNetwork)} target={getTarget(type)} className="text-blue-200">
                    {resolvedAddress ? resolvedAddress : renderString}
                </Link>
            )}
            {eyes && <TextVisibleButton isShow={showText} handleText={(showText) => setShowText(!!showText)} />}
            <CopyButton text={text} copyIcon={copyIcon} />
        </div>
    );
}

export default Token;

function getHrefLink(type: string | undefined, text: string, network: string) {
    if (type == undefined) return '#';
    if (type == 'userOp') {
        return {
            pathname: `/userOpHash/${text}`,
            query: { network: network },
        };
    } else if (type == 'address') {
        return {
            pathname: `/account/${text}`,
            query: { network: network },
        };
    } else if (type == 'factory') {
        return {
            pathname: `/factory/${text}`,
            query: { network: network },
        };
    } else if (type == 'tx') {
        return {
            pathname: `/tx/${text}`,
            query: { network: network },
        };
    } else if (type == 'bundler') {
        return {
            pathname: `/bundler/${text}`,
            query: { network: network },
        };
    } else if (type == 'paymaster') {
        return {
            pathname: `/paymaster/${text}`,
            query: { network: network },
        };
    } else if (type == 'erc20Transfer' || type == 'erc721Transfer' || type == 'transaction') {
        return {
            pathname: NETWORK_SCANNER_MAP[network] + `/tx/${text}`,
        };
    } else {
        return '#';
    }
}

function getTarget(type: string | undefined) {
    // console.log(type)
    if (type == undefined) return '_self';

    // if (type == 'address') {
    //     return '_blank';
    // }
    if (type == 'bundle') {
        return '_self';
    } else if (type == 'erc20Transfer' || type == 'erc721Transfer' || type == 'transaction') {
        return '_blank';
    } else {
        return '_self';
    }
}
