import IconImgButton from '@/components/common/icon_button/IconButton';
import React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import {useRouter} from "next/router";
import {useSession, signOut} from "next-auth/react"

function User() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const { data: sessions } = useSession()
    const router = useRouter();

    const { id_token, idToken } = sessions?.user as { id_token?: string, idToken?: string} || {};
    const handleClose = (url?: string) => {
        setAnchorEl(null);
        url && router.push(url)
    };

    const dropdown = [
        ["My Profile", "/my-profile", "/images/icon-container (2).svg"],
        ["API Plans", "https://adityaagarwal.notion.site/Products-Services-c3633ff3f9ea4aeeb1892ae1303439ba#4b87ad9fa7a346548e1c7cd71803821d", "/images/API.svg"],
        ["API Keys", "/apiKeys", "images/shield-key.svg"],
    ]
    const propsConfig = {
        elevation: 0,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1,
            width: 190,
            '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.7,
                mr: 1,
            },
            '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
            },
        },
    }
    return (
        <div className="flex items-center gap-1">
            {(id_token || idToken) ? <>
                <IconImgButton icon="/images/icon-container (1).svg"/>
                <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? 'user-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <img src={"/images/icon-container (2).svg"} alt="user"/>
                    </IconButton>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="user-menu"
                    open={open}
                    onClose={() => handleClose()}
                    onClick={() => handleClose()}
                    PaperProps={propsConfig}
                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    {dropdown?.map((menuItem, index) => (
                        <MenuItem key={index} className="ml-0" onClick={() => handleClose(menuItem[1])}>
                            <ListItemIcon>
                                <img src={menuItem[2]} alt=""/>
                            </ListItemIcon>
                            <span className="mr-3.5"> {menuItem[0]}</span>
                        </MenuItem>
                    ))
                    }
                    <Divider/>
                    <MenuItem>
                        <Button fullWidth color="inherit"
                                variant="outlined"
                                onClick={() => signOut()}
                                startIcon={<Logout fontSize="inherit"/>}>
                            Sign Out
                        </Button>
                    </MenuItem>
                </Menu></> : <>
                <Button fullWidth color="inherit"
                        variant="outlined"
                        onClick={() => router.push(`/login?callBack=${router?.asPath ? router?.asPath : '/'}`)}
                        startIcon={<Login fontSize="inherit"/>}>
                    Sign In
                </Button>
            </>}
        </div>
    );
}

export default User;
