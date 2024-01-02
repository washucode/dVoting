//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


contract DVoting {
    // content of polls created
    struct PollsStruct {
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

    // track the number of polls created
    uint pollsCount;

    // track the number of contestants/ users created
    uint usersCount;
    PollsStruct[] polls;

    // map the address of the user to the user struct
    mapping(address => VoterStruct) public users;
    // see if user has voted
    mapping(uint => mapping(address => bool)) voted;
    // see if user has been added to a poll/has contested
    mapping(uint => mapping(address => bool)) contested;
    // map contestants of a poll
    mapping(uint => VoterStruct[])  contestants;
    // check if poll exists
    mapping(uint => bool)  pollExists;



    // create event for voted
    event Voted(
        string fullname, 
        address indexed voter, 
        uint timestamp
        
        );

    modifier userOnly{
        require(users[msg.sender].voter == msg.sender, "You are not a user");
        _;
    }

    // create poll

    function createPoll(
        string memory image,
        string memory title,
        string memory description,
        uint startsAt,
        uint endsAt
        ) public userOnly {
            require(bytes(title).length > 0, "Title is required");
            require(bytes(description).length > 0, "Description is required");
            require(startsAt > 0 && endsAt > startsAt, "End date must be greater than start date");
            require(endsAt > 0, "End time is required");

            PollsStruct memory poll;
            poll.id = pollsCount++;
            poll.image = image;
            poll.title = title;
            poll.description = description;
            poll.startsAt = startsAt;
            poll.endsAt = endsAt;
            poll.timestamp = block.timestamp;
            poll.director = msg.sender;

            polls.push(poll);
            pollExists[poll.id] = true;
    }

    // update poll
    function updatePoll(
        uint id,
        string memory image,
        string memory title,
        string memory description,
        uint startsAt,
        uint endsAt
        ) public userOnly {
            require(pollExists[id], "Poll does not exist");
            require(polls[id].director == msg.sender, "You are not the director of this poll");
            require(bytes(title).length > 0, "Title is required");
            require(bytes(description).length > 0, "Description is required");
            require(startsAt > 0 && endsAt > startsAt, "End date must be greater than start date");
            require(endsAt > 0, "End time is required");

            polls[id].image = image;
            polls[id].title = title;
            polls[id].description = description;
            polls[id].startsAt = startsAt;
            polls[id].endsAt = endsAt;
            
    }

    // delete poll
    function deletePoll(uint id) public userOnly {
        require(pollExists[id], "Poll does not exist");
        require(polls[id].director == msg.sender, "You are not the director of this poll");
        polls[id].deleted = true;
    }

    // get poll

    function getPoll(uint id) public view returns(
        PollsStruct memory 
        ) {
            return polls[id];
    }

    // get all polls

    function getAllPolls() public view returns(
        PollsStruct[] memory 
        ) {
            return polls;
    }

    // register  user

    function register(
        string memory image,
        string memory fullname
        ) public {
            require(bytes(fullname).length > 0, "Fullname is required");
            require(users[msg.sender].voter != msg.sender, "You are already registered");

            VoterStruct memory user;
            user.id = usersCount++;
            user.image = image;
            user.fullname = fullname;
            user.voter = msg.sender;
            users[msg.sender] = user;
    }

    // register contestant to poll

    function contest (uint id) public userOnly{
        require(pollExists[id], "Poll does not exist");
        require(!contested[id][msg.sender], "You have already contested");
        require(polls[id].endsAt > block.timestamp, "Poll has ended");
        require(polls[id].startsAt < block.timestamp, "Poll has not started");

        VoterStruct memory user = users[msg.sender];
        contestants[id].push(user);
        contested[id][msg.sender] = true;
        polls[id].contestants++;
    }

    // get contestants of a poll
    function listContestants(uint id) public view returns(VoterStruct[] memory){
        require(pollExists[id], "Poll does not exist");
        return contestants[id];  
    }

    // vote for contestant

    function vote (uint id, uint cid) public userOnly{
        require(pollExists[id], "Poll does not exist");
        require(polls[id].endsAt > block.timestamp, "Poll has ended");
        require(polls[id].startsAt < block.timestamp, "Poll has not started");
        require(!voted[id][msg.sender], "You have already voted");
    
        VoterStruct memory user = users[msg.sender];
        contestants[id][cid].votes++;
        contestants[id][cid].voters.push(user.voter);
        voted[id][user.voter] = true;
        polls[id].votes++;
        emit Voted(
            user.fullname, 
            user.voter, 
            block.timestamp);
    }


}