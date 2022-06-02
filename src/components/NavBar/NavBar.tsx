import React from 'react';
import './nav-bar.scss';

import { Flex, Button, Menu, MenuButton, MenuItem, MenuList, Spacer, Link } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function NavBar(props: any) {

    return (
        <Flex bg="gray.700">
            <Spacer />
                
                <Menu>
                    <MenuButton m="1" as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
                        Games
                    </MenuButton>
                    <MenuList>
                        <Link _hover={{textDecoration: "none"}} href="crossword"><MenuItem>Crossword</MenuItem></Link>
                        <Link _hover={{textDecoration: "none"}} href="memory"><MenuItem>Memory</MenuItem></Link>
                        <Link _hover={{textDecoration: "none"}} href="sudoku"><MenuItem>Sudoku</MenuItem></Link>
                    </MenuList>
                </Menu>
                
        </Flex>
    );
}

export default NavBar;