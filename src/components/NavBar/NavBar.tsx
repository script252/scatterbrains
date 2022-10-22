import React from 'react';
import {useLocation} from 'react-router-dom';
import './nav-bar.scss';

import { Flex, Button, Menu, MenuButton, MenuList, Spacer,/*, Link*/ } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function NavBar(props: any) {

    const {onNewGame, showNewGameButton} = props;
    const location = useLocation();
    
    return (
        <Flex bg="gray.700" width="100%">
            <a href="https://www.buymeacoffee.com/andrewclosson" className="coffee-link"><img alt="Thanks for your support!" src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=andrewclosson&button_colour=40DCA5&font_colour=ffffff&font_family=Arial&outline_colour=000000&coffee_colour=FFDD00" /></a>
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