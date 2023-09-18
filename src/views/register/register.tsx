import React, {useState} from 'react';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import check from '../../../public/images/Success.svg';
import Link from 'next/link';
import MiniFooter from '@/components/global/minifooter';
import {signIn} from "next-auth/react";
import {Amplify, Auth} from "aws-amplify";
import Spinner from "@/components/common/Spinner";
import {useRouter} from "next/router";

const COGNITO_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION;
const LOGIN_REGISTER_COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_LOGIN_REGISTER_COGNITO_CLIENT_ID;
const COGNITO_USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;


const RegisterComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const {query} = useRouter();
    const handleRegistration = async () => {
        // Validate confirm password
        setErrorMessage('');
        setSuccessMessage('');
        if (!email || !password || !confirmPassword) {
            setErrorMessage('All fields are required');
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorMessage('Invalid email format');

            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');

            return;
        }
        setLoading(true)

        const awsAmplifyConfig = {
            mandatorySignId: true,
            region: COGNITO_REGION,
            userPoolId: COGNITO_USER_POOL_ID,
            userPoolWebClientId: LOGIN_REGISTER_COGNITO_CLIENT_ID
        }
        Amplify.configure(awsAmplifyConfig)
        const params = {
            password: password,
            username: email,
            attributes: {email: email}
        }
        try {
            const signUpResponse = await Auth.signUp(params);
            console.log("DeliveryMedium:", signUpResponse)
            if (signUpResponse) {
                if (signUpResponse.codeDeliveryDetails.DeliveryMedium === "EMAIL") {
                    setSuccessMessage("Please check your email for verification link")
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage('An unexpected error occurred');
                console.error('An unexpected error occurred:', err);
            }
        }
        setLoading(false)

    };
    const handleLoginWithGoogle = async () => {
        setLoading(true)
        await signIn("cognito_google", {redirect: false, callbackUrl: `http://localhost:3000${query?.callBack}`})
    };

    return (
        <>
            <div
                className="Maincontainer bg-dark-600  d-flex justify-content-center align-items-center w-full"
                style={{height: 'auto !important', minHeight: '100vh'}}
            >
                <div className="container w-full pt-6 px-6 gap-20"
                     style={{display: 'flex', justifyContent: 'center', marginTop: "-35px"}}>
                    <div className="mt-20">
                        <Image src={logo} alt="logo" className=" text-center"/>
                        <div style={{display: 'flex', alignItems: 'center'}} className="mt-3">
                            <Image src={check} alt="logo" className=" text-center" style={{marginTop: '-66px'}}/>
                            <p className="text-white ml-3">
                                <span style={{color: '#90A4AE'}}>Real-time Monitoring. </span>Track <br/> Ethereum
                                network hash-rate and
                                <br/> difficulty in real-time with charts and <br/> historical data.
                            </p>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}} className="mt-3">
                            <Image src={check} alt="logo" className="text-center mt-2" style={{marginTop: '-66px'}}/>
                            <p className="text-white ml-3">
                                <span style={{color: '#90A4AE'}}>Miner Distribution Analysis.</span>
                                <br/>
                                Analyze miner distribution on the
                                <br/>
                                network to understand risks to <br/>
                                security and decentralization.
                            </p>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}} className="mt-3">
                            <Image src={check} alt="logo" className="text-center mt-2" style={{marginTop: '-66px'}}/>
                            <p className="text-white ml-3">
                                <span style={{color: '#90A4AE'}}>Miner Distribution Analysis.</span>
                                <br/>
                                Analyze miner distribution on the
                                <br/>
                                network to understand risks to <br/>
                                security and decentralization.
                            </p>
                        </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <div className="sec-box bg-white rounded px-10 mt-8 py-5"
                             style={{height: 'auto !important', width: '464px'}}>
                            <p className="text-black text-xl font-weight-bold mt-4 text-center"
                               style={{fontSize: '1.5rem'}}>
                                Register
                            </p>
                            {errorMessage && <div
                              className="font-regular mt-5 relative  block w-full rounded-lg bg-red-500 p-2 text-base leading-5 text-white opacity-100">
                                {errorMessage}
                            </div>}
                            {successMessage && <div
                              className="font-regular mt-5 relative  block w-full rounded-lg bg-green-500 p-4 text-base leading-5 text-white opacity-100">
                                {successMessage}
                            </div>}
                            {loading && <div className={'align-items-center d-flex flex justify-center mt-3'}>
                              <Spinner height={'1rem'} width={'1rem'}/>
                            </div>}
                            <button
                                type="button"
                                onClick={() => handleLoginWithGoogle()}
                                className="w-full mt-4 text-center justify-center focus:ring-0 focus:outline-none rounded border border-dark-200 md:text-md sm:text-sm text-[10px] px-5 py-3 inline-flex items-center mb-2"
                            >
                                <img src="/images/google.svg" alt=""/>
                                <span
                                    className="uppercase font-medium text-dark-600 ml-1 sm:ml-2 tracking-[1.5px]">continue with google</span>
                            </button>
                            {/* <button
                                onClick={handleGithubLogin}
                                className="rounded border py-2 text-black font-weight-bold mt-2 w-full gap-3"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Image src={github} alt="logo"/>
                                <p className="text-black font-weight-bold" style={{marginLeft: '17px'}}>
                                    LOGIN WITH GITHUB
                                </p>
                            </button>*/}
                            <p className="text-black text-md font-weight-bold mt-2 text-center">or</p>
                            <input
                                type="text"
                                className="form-control text-black bottom-border w-full mt-4"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                id="input_email"
                                required
                            />
                            <input
                                type="password"
                                className="form-control text-black bottom-border w-full mt-9"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                id="input_password"
                                required
                            />
                            <input
                                type="password"
                                className="form-control text-black bottom-border w-full mt-9"
                                placeholder="Password repeat"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                id="input_password_repeat"
                                required
                            />
                            <button
                                className="text-white font-weight-bold text-center bg-dark-600 w-full rounded py-2 mt-9"
                                onClick={handleRegistration}
                                type="button">
                                REGISTER
                            </button>
                            <p className="text-black text-md font-weight-bold mt-9 text-center">
                                By clicking “Create account” or “Continue with Google” or “Continue with Github”, you
                                agree to the&nbsp;
                                jiffyscan.xyz
                                <a
                                    href="https://www.notion.so/adityaagarwal/Terms-of-Use-0012b80699cc4b948cdae9e42983035b"
                                    style={{color: '#1976D2'}}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Terms of Service
                                </a>
                                &nbsp;and&nbsp;
                                <a
                                    href="https://adityaagarwal.notion.site/Privacy-Policy-5f05315af636474797f1255d338a0d76?pvs=4"
                                    style={{color: '#1976D2'}}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Privacy Policy
                                </a>
                            </p>

                            <Link href="/login">
                                <p className=" text-black text-md font-weight-bold mt-5 text-center">
                                    Already have an account? <span style={{color: '#1976D2'}}>Log in</span>
                                </p>
                            </Link>
                            <style>
                                {`
                    .bottom-border {
                      border-left: none;
                      border-right: none;
                      border-top: none;
                      border-radius: 0;
                      border-bottom: 1px solid #000;
                    }
                    .bottom-border::placeholder {
                      color: #000;
                    }
                    @media (max-width: 576px) {
                        .Maincontainer{
                            height:auto !important;
                        }
                    .container {
                        flex-direction:column
                    }
                      }
                      @media (min-width: 576px) and (max-width: 768px) {
                        .Maincontainer{
                            height:auto !important;
                        }
                        .container {
                            flex-direction:column;
                            width:450px !important;
                        }
                      }
                      @media (min-width: 768px) and (max-width: 992px) {
                        .footer{
                            margin-bottom: 40px !important;
                        }
                      }
                      .box{
                        border:1px solid #e5e7eb !important;
                        box-shadow:none !important;
                        border-radius: 5px !important;
                      }
                      .sec-box button{
                        justify-content:center
                      }
                    `}
                            </style>
                        </div>
                    </div>
                </div>
                <MiniFooter/>
            </div>
        </>
    );
};
export default RegisterComponent;
