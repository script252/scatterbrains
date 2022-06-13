import React from 'react';
import {Link} from 'react-router-dom';
import './nav-bar.scss';

import { Flex, Button, Menu, MenuButton, MenuItem, MenuList, Spacer/*, Link*/ } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function NavBar(props: any) {

    return (
        <Flex bg="gray.700" width="100%">
            <Spacer />
                
                <Menu>
                    <MenuButton m="1" as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
                        Games
                    </MenuButton>
                    <MenuList>
                        <Link  to="crossword"><MenuItem>Crossword</MenuItem></Link>
                        <Link  to="memory"><MenuItem>Memory</MenuItem></Link>
                        <Link  to="sudoku"><MenuItem>Sudoku</MenuItem></Link>
                    </MenuList>
                </Menu>
                
        </Flex>
    );
}

export default NavBar;