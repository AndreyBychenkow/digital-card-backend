import { Injectable } from '@nestjs/common';
import { EducationModel } from './models/education.model.js';
import { ProfileLinkModel } from './models/profile-link.model.js';
import { ProfileModel } from './models/profile.model.js';
import { OWNER_PROFILE_SLUG } from './profile.constants.js';
import { ProfileRepository } from './profile.repository.js';

@Injectable()
export class ProfileService {
  constructor(private readonly profiles: ProfileRepository) {}

  async getOwnerProfile(): Promise<ProfileModel> {
    const profile = await this.profiles.findBySlug(OWNER_PROFILE_SLUG);
    if (!profile) {
      // The seed runs on every start, so a missing row means the database was never prepared.
      // This is a server-side problem, so the client gets an internal error, not a 404.
      throw new Error(`Profile "${OWNER_PROFILE_SLUG}" is missing from the database. Seed has not run.`);
    }

    return {
      id: profile.id,
      name: profile.name,
      title: profile.title,
      description: profile.description,
      location: profile.location,
      availability: profile.availability,
    };
  }

  async getLinks(profileId: number): Promise<ProfileLinkModel[]> {
    const rows = await this.profiles.findLinks(profileId);
    return rows.map((row) => ({ kind: row.kind, label: row.label, url: row.url }));
  }

  async getEducation(profileId: number): Promise<EducationModel[]> {
    const rows = await this.profiles.findEducation(profileId);
    return rows.map((row) => ({
      id: row.id,
      institution: row.institution,
      degree: row.degree,
      specialty: row.specialty,
      graduationYear: row.graduationYear,
    }));
  }
}
