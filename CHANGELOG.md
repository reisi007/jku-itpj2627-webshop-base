# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Project scaffold with TypeScript 7, Fastify 5, ESM, strict mode
- Domain types: Category, Product, Variant, Offer, Vendor, Warehouse, Voucher, Dataset
- Cart validation types: ValidateRequest, ValidateResponse, CartIssue, Shipment
- Dataset loader with zod 4 validation and lookup indexes
- JKU-Linz-themed sample dataset (201 products, 1765 offers, 84% free shipping)
- Dataset generator (`scripts/generate-data.mjs`) — run to regenerate `data/dataset.json`
- Per-vendor shipping model with `freeShippingThreshold`
- Austria Paketsteuer (€3/package) modeled as `Warehouse.packageTax`
- CLI demo client (`client/demo.ts`) — 7-step showcase of API capabilities
- Build agent authority documented in Agents.md
- Subagent authority: verification subagents may spawn fix subagents

### Changed

- Migrated from npm to pnpm as package manager
- Upgraded all dependencies to latest: Fastify 5.10, zod 4.4, TypeScript 7, vitest 4
