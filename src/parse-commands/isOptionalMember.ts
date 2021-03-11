import { PropertySignature } from "typescript";

export function isOptionalMember(member: PropertySignature): boolean {
    return member.questionToken !== undefined;
}