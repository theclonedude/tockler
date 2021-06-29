import {
    AiOutlineBars,
    AiOutlineAreaChart,
    AiOutlineSearch,
    AiOutlineSetting,
    AiOutlineQuestionCircle,
    AiFillTrademarkCircle,
} from 'react-icons/ai';
import React from 'react';
import { Box } from '@chakra-ui/layout';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { Header } from '../Header/Header';
import { MenuItem } from '../Header/MenuItem';
import { Link as RouterLink } from 'react-router-dom';

export const HeaderMenu = () => (
    <Header brandLinkProps={{ to: '/app/timeline', as: RouterLink }}>
        <MenuItem to="/app/timeline" icon={<AiOutlineBars />} title="Timeline" />
        <MenuItem to="/app/summary" icon={<AiOutlineAreaChart />} title="Summary" />
        <MenuItem to="/app/search" icon={<AiOutlineSearch />} title="Search" />
        <MenuItem to="/app/settings" icon={<AiOutlineSetting />} title="Settings" />
        <MenuItem to="/app/support" icon={<AiOutlineQuestionCircle />} title="Support" />
        <MenuItem to="/trayPage" icon={<AiFillTrademarkCircle />} title="Tray" />
        <Box flex="1" />
        <Box>
            <ColorModeSwitcher />
        </Box>
    </Header>
);
