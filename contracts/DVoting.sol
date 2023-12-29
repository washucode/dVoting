//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


contract DVoting {
    // content of polls created
    struct pollsStruct {
        uint id;
        string image;
        string title;
        string description;
        uint votes;
        uint contestants;
        bool deleted;
        address director;
        uint startsAt;
        uint endsAt;
        uint timestamp;   
    }

    // content of contestants, voter or user
    struct VoterStruct {
        uint id;
        string image;
        string fullname;
        address voter;
        uint votes;
        address[] voters; 
    }
}