// Home.js

import React, { useState, useEffect } from 'react';
import Container from './Container';
import NavigationBar from './NavigationBar';
import Chat from './Chat';
import ChatService from '../services/WebSocketService'; // Adjust path as necessary

const Home = () => {


    return (
        <Container>
            <NavigationBar />
            <Chat/>
        </Container>
    );
};

export default Home;