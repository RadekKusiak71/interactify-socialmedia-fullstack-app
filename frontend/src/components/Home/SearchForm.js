import React, { useCallback, useEffect, useState } from 'react';
import classes from './SearchForm.module.css';
import searchIcon from '../../assets/search.svg';
import closeIcon from '../../assets/close.svg';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const openAnimation = {
    hidden: {
        width: '0%',
        opacity: 0,
    },
    visible: {
        opacity: 1,
        width: '100%',
        transition: {
            duration: 0.5,
            damping: 20,
            type: 'spring',
            stiffness: 300,
        },
    },
    exit: {
        width: '0%',
        opacity: 0,
    },
};

const closeAnimation = {
    hidden: {
        width: '590px',
        opacity: 0,
    },
    visible: {
        opacity: 1,
        width: '100px',
        transition: {
            duration: 0.5,
            damping: 20,
            type: 'spring',
            stiffness: 300,
        },
    },
    exit: {
        width: '590px',
        opacity: 0,
    },
};

const appearAnimation = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            damping: 20,
            stiffness: 300,
            delay: 0.5,
        },
    },
    exit: {
        opacity: 0,
    },
};


const SearchForm = () => {
    const [activeSearch, setActiveSearch] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchClose = () => {
        setActiveSearch(!activeSearch)
        setSearchInput('')
        setSearchResults([])
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const fetchData = useCallback(async () => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/search/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search_input: searchInput })
            });

            let data = await response.json();

            if (response.ok) {
                setSearchResults(data.search_data);
                console.log(data)
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }, [searchInput]);


    useEffect(() => {
        if (searchInput.length > 0) {
            const debounce = setTimeout(() => fetchData(), 400)
            return () => clearTimeout(debounce)
        } else {
            setSearchResults([])
        }
    }, [searchInput, fetchData]);

    return (
        <>
            {activeSearch ? (
                <motion.div
                    variants={openAnimation}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    className={classes['search-input']}
                >
                    <motion.img
                        variants={appearAnimation}
                        initial='hidden'
                        animate='visible'
                        exit='exit'
                        src={closeIcon}
                        alt='Close Icon'
                        onClick={() => handleSearchClose(false)}
                    />

                    <motion.input
                        variants={appearAnimation}
                        initial='hidden'
                        animate='visible'
                        exit='exit'
                        placeholder='Search for user or a group'
                        value={searchInput}
                        onChange={handleChange}
                    />

                    {searchResults.length > 0 ? (
                        <div className={classes['search-results']}>
                            <ul>
                                {searchResults.map((result, idx) => (
                                    <motion.li
                                        animate={{
                                            x: [-300, 0],
                                        }} whileHover={{ paddingLeft: '20px' }} key={idx} id={result.profile_id || result.group_id}>
                                        {result.profile ? (
                                            <>
                                                <Link to={`account/${result.username}`}>{result.username}</Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link to='' >{result.group_name}</Link>
                                            </>
                                        )}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    ) : (searchInput.length > 0 &&
                        <div className={classes['search-results']}>
                            <li>
                                <span>No results</span>
                            </li>
                        </div>
                    )}
                </motion.div >
            ) : (
                <motion.div
                    variants={closeAnimation}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    className={classes['search-input']}
                >
                    <img
                        src={searchIcon}
                        alt='Search Icon'
                        onClick={() => handleSearchClose(true)}
                    />
                </motion.div>
            )}
        </>
    );
};

export default SearchForm;
