# 1. Problem Statement

## Project Title
**Yatara Ceylon - Elite Travel & Fleet Management Mobile System**

## 1.1 Background & Motivation
Sri Lanka is a premier global tourist destination; however, the luxury travel sector is often fragmented. High-end travelers face friction when booking bespoke travel packages, coordinating chauffeur-driven fleet services, and managing real-time accommodations through disparate platforms. 

Simultaneously, travel agencies struggle with decentralized management of users, vehicle fleets, tour packages, bookings, and financial invoicing. Yatara Ceylon currently utilizes a web-based dashboard that restricts administrative staff to desktop environments, limiting on-the-go operational efficiency.

## 1.2 Problem Definition
The existing workflow for Yatara Ceylon relies on fragmented web-only dashboards and manual processes, lacking a centralized mobile-first ecosystem. Administrators and staff need an integrated mobile solution to manage core operational entities efficiently while away from the desk. 

Specifically, the system lacks a unified mobile application that provides real-time CRUD (Create, Read, Update, Delete) capabilities across six critical administrative modules: 
1. User Accounts & Access Control
2. Tour Packages & Content Management
3. Vehicle Fleet Logistics
4. Bookings & Reservations
5. Financial Operations (Invoices)
6. Financial Operations (Payments)

## 1.3 Project Objectives

**Primary Objective:** 
To design and develop a robust, cross-platform Mobile Application using React Native, powered by a centralized REST API (Node.js/Express) and a highly scalable NoSQL database (MongoDB).

**Operational Objective:** 
To digitalize the administration of Yatara Ceylon by providing seamless mobile CRUD operations for the 6 distinct administrative modules mentioned above. The project ensures equal workload distribution among 6 development team members, where each member is responsible for the full-stack implementation of their respective module.

**Technical Objective:** 
To implement a secure, token-based authentication system (JSON Web Tokens - JWT) ensuring that only authorized personnel can manipulate core business data. Furthermore, to architect the system such that it securely integrates with the pre-existing MongoDB cluster used by the Yatara Ceylon web application.
