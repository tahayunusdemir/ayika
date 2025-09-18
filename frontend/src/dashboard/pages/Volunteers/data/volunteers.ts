import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export interface Volunteer {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  joinDate: string;
}

const INITIAL_VOLUNTEERS_STORE: Volunteer[] = [
  {
    id: 1,
    name: 'Ahmet',
    surname: 'Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    phone: '+90 532 123 4567',
    city: 'İstanbul',
    joinDate: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Fatma',
    surname: 'Demir',
    email: 'fatma.demir@email.com',
    phone: '+90 533 234 5678',
    city: 'Ankara',
    joinDate: '2024-02-20T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Mehmet',
    surname: 'Kaya',
    email: 'mehmet.kaya@email.com',
    phone: '+90 534 345 6789',
    city: 'İzmir',
    joinDate: '2023-11-10T00:00:00.000Z',
  },
  {
    id: 4,
    name: 'Ayşe',
    surname: 'Özkan',
    email: 'ayse.ozkan@email.com',
    phone: '+90 535 456 7890',
    city: 'Bursa',
    joinDate: '2024-03-05T00:00:00.000Z',
  },
];

export function getVolunteersStore(): Volunteer[] {
  const stringifiedVolunteers = localStorage.getItem('volunteers-store');
  return stringifiedVolunteers ? JSON.parse(stringifiedVolunteers) : INITIAL_VOLUNTEERS_STORE;
}

export function setVolunteersStore(volunteers: Volunteer[]) {
  return localStorage.setItem('volunteers-store', JSON.stringify(volunteers));
}

export async function getMany({
  paginationModel,
  filterModel,
  sortModel,
}: {
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}): Promise<{ items: Volunteer[]; itemCount: number }> {
  const volunteersStore = getVolunteersStore();

  let filteredVolunteers = [...volunteersStore];

  // Apply filters
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredVolunteers = filteredVolunteers.filter((volunteer) => {
        const volunteerValue = volunteer[field as keyof Volunteer];

        switch (operator) {
          case 'contains':
            return String(volunteerValue).toLowerCase().includes(String(value).toLowerCase());
          case 'equals':
            return volunteerValue === value;
          case 'startsWith':
            return String(volunteerValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(volunteerValue).toLowerCase().endsWith(String(value).toLowerCase());
          case '>':
            return volunteerValue > value;
          case '<':
            return volunteerValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredVolunteers.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        if (a[field as keyof Volunteer] < b[field as keyof Volunteer]) {
          return sort === 'asc' ? -1 : 1;
        }
        if (a[field as keyof Volunteer] > b[field as keyof Volunteer]) {
          return sort === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // Apply pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginatedVolunteers = filteredVolunteers.slice(start, end);

  return {
    items: paginatedVolunteers,
    itemCount: filteredVolunteers.length,
  };
}

export async function getOne(volunteerId: number) {
  const volunteersStore = getVolunteersStore();

  const volunteerToShow = volunteersStore.find((volunteer) => volunteer.id === volunteerId);

  if (!volunteerToShow) {
    throw new Error('Gönüllü bulunamadı');
  }
  return volunteerToShow;
}

export async function createOne(data: Omit<Volunteer, 'id'>) {
  const volunteersStore = getVolunteersStore();

  const newVolunteer = {
    id: volunteersStore.reduce((max, volunteer) => Math.max(max, volunteer.id), 0) + 1,
    ...data,
  };

  setVolunteersStore([...volunteersStore, newVolunteer]);

  return newVolunteer;
}

export async function updateOne(volunteerId: number, data: Partial<Omit<Volunteer, 'id'>>) {
  const volunteersStore = getVolunteersStore();

  let updatedVolunteer: Volunteer | null = null;

  setVolunteersStore(
    volunteersStore.map((volunteer) => {
      if (volunteer.id === volunteerId) {
        updatedVolunteer = { ...volunteer, ...data };
        return updatedVolunteer;
      }
      return volunteer;
    }),
  );

  if (!updatedVolunteer) {
    throw new Error('Gönüllü bulunamadı');
  }
  return updatedVolunteer;
}

export async function deleteOne(volunteerId: number) {
  const volunteersStore = getVolunteersStore();

  setVolunteersStore(volunteersStore.filter((volunteer) => volunteer.id !== volunteerId));
}

// Validation follows the Standard Schema pattern
type ValidationResult = { issues: { message: string; path: (keyof Volunteer)[] }[] };

export function validate(volunteer: Partial<Volunteer>): ValidationResult {
  let issues: ValidationResult['issues'] = [];

  if (!volunteer.name) {
    issues = [...issues, { message: 'Ad alanı zorunludur', path: ['name'] }];
  }

  if (!volunteer.surname) {
    issues = [...issues, { message: 'Soyad alanı zorunludur', path: ['surname'] }];
  }

  if (!volunteer.email) {
    issues = [...issues, { message: 'E-posta alanı zorunludur', path: ['email'] }];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(volunteer.email)) {
    issues = [...issues, { message: 'Geçerli bir e-posta adresi giriniz', path: ['email'] }];
  }

  if (!volunteer.phone) {
    issues = [...issues, { message: 'Telefon alanı zorunludur', path: ['phone'] }];
  }

  if (!volunteer.city) {
    issues = [...issues, { message: 'Şehir alanı zorunludur', path: ['city'] }];
  }

  if (!volunteer.joinDate) {
    issues = [...issues, { message: 'Katılım tarihi zorunludur', path: ['joinDate'] }];
  }

  return { issues };
}
