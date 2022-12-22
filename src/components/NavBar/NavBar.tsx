import React from 'react';
import {useLocation} from 'react-router-dom';
import './nav-bar.scss';

import { Flex, Button, Menu, MenuButton, MenuList, Spacer, Box/*, Link*/ } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { SiBuymeacoffee } from 'react-icons/si';

function NavBar(props: any) {

    const {onNewGame, showNewGameButton} = props;
    const location = useLocation();
    
    return (
        <Flex bg="gray.700" width="100%">
            <Box m="1"><a href="https://www.buymeacoffee.com/andrewclosson" target="_blank" rel="noreferrer"><Button leftIcon={<SiBuymeacoffee/>} h="var(--chakra-sizes-10)" colorScheme="teal">Buy me a coffee</Button></a></Box>
            
            <Spacer />
                <Button m="1" as={Button} colorScheme="gray" hidden={!showNewGameButton || location.pathname === '/'}
                    onClick={onNewGame}>New Game</Button>
                <Menu>
                    <MenuButton m="1" as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
                        Games
                    </MenuButton>
                    <MenuList>
                        {React.Children.map(props.children, menuItem => {
                            return (menuItem);
                        })}
                    </MenuList>
                </Menu>
                
        </Flex>
    );
}

export default NavBar;