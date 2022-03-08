import type { LegalEntityReference, OrganizationalUnitReference } from '@windingtree/org.json-schema/types/org.json';
export interface GenericStateRecord {
    id: string;
    [key: string]: unknown;
}
export interface Space extends OrganizationalUnitReference, GenericStateRecord {
    updated: string;
}
export interface LodgingFacility extends LegalEntityReference, GenericStateRecord {
    updated: string;
    spaces: Space[];
}
