import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from '../store/slices/groupsSlice';
import SearchInputCard from '../components/SearchInputCard';
import { Tooltip } from 'react-tooltip'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../group.css';

const Groups = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const user = useSelector((s) => s.auth.user);
    const { groups, loading, error } = useSelector((s) => s.groups);

    // Get unique categories for filtering
    const categories = useMemo(() => {
        const cats = [...new Set(groups.map(g => g.category))];
        return cats.filter(cat => cat && cat !== 'undefined');
    }, [groups]);

    const filteredGroups = useMemo(() => {
        let filtered = groups;

        // Filter by search term
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            filtered = filtered.filter(
                (g) =>
                    g.name.toLowerCase().includes(term) ||
                    (g.category ?? '').toLowerCase().includes(term)
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(g => g.category === selectedCategory);
        }

        return filtered;
    }, [searchTerm, selectedCategory, groups]);



    const renderCard = (g) => (
        <div key={g.id} className="group-card">
            <div className="group-cover">
                <img
                    className="cover-image"
                    src={g.cover_url || 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=3546&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                    alt={g.name}
                />
                <div className="group-overlay">
                    <div className="group-stats">
                        <span className="stat-item">
                            <i className="fas fa-users"></i>
                            {g.members_count}
                        </span>
                        <span className="stat-item">
                            <i className="fas fa-list"></i>
                            {g.group_posts_count}
                        </span>
                    </div>
                </div>
            </div>
            <div className="group-content">
                <div className="group-header">
                    {/* <h4 className="group-name text-truncate" title={g.name}>{g.name}</h4> */}
                    <h4
                        className="group-name text-truncate"
                        data-tooltip-id={`group-tooltip-${g.id}`}
                        data-tooltip-content={g.name}
                    >
                        {g.name}
                    </h4>

                    <Tooltip
                        id={`group-tooltip-${g.id}`}
                        place="top"
                        style={{
                            backgroundColor: "#333",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            maxWidth: "250px",
                        }}
                    />
                    <span className="group-category">
                        {g.category?.split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ') || 'No Category'}
                    </span>
                </div>
                <div className="group-description">
                    <p className="group-summary">
                        {g.description.length > 80
                            ? `${g.description.slice(0, 80)}...`
                            : g.description}
                    </p>
                </div>
                <div className="group-actions">
                    <button
                        className="btn btn-primary btn-view-group"
                        onClick={() => navigate(`/group/${g.slug}`)}
                    >
                        <i className="fas fa-eye me-2"></i>
                        View Group
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="groups-page">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="container">
                    <div className="hero-content text-center">
                        <h1 className="hero-title">Discover Amazing Groups</h1>
                        <p className="hero-subtitle">
                            Connect with communities that share your interests and passions
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            {/* Search and Filters */}
                            <div className="search-filters-section">
                                <div className="row align-items-end">
                                    <div className="">
                                        <SearchInputCard
                                            placeholder="Search for groups..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Groups Grid */}
                            {filteredGroups.length === 0 ? (
                                <div className="no-results">
                                    <div className="no-results-icon">
                                        <i className="fas fa-search"></i>
                                    </div>
                                    <h4>No groups found</h4>
                                    <p>
                                        {searchTerm
                                            ? `No groups match "${searchTerm}". Try adjusting your search.`
                                            : 'No groups available at the moment.'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="groups-grid">
                                    <div className="row g-4">
                                        {filteredGroups.map((g) => (
                                            <div key={g.id} className="col-lg-4 col-md-6">
                                                {renderCard(g)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Groups;
