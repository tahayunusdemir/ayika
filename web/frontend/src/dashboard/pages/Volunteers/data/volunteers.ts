import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export type VolunteerType = 'toplama' | 'dağıtım' | 'taşıma' | 'karma';

export interface Volunteer {
  id: number;
  gonulluluk_no: string; // Gönüllülük numarası (G ile başlayan)
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  joinDate: string;
  volunteerType: VolunteerType; // Gönüllü tipi
}

const INITIAL_VOLUNTEERS_STORE: Volunteer[] = [
  // Toplama gönüllüleri
  {
    id: 1,
    gonulluluk_no: 'G0123456789',
    name: 'Kemal',
    surname: 'Özdemir',
    email: 'kemal.ozdemir@email.com',
    phone: '+90 532 123 4567',
    city: 'Ankara',
    joinDate: '2024-01-15T00:00:00.000Z',
    volunteerType: 'toplama',
  },
  {
    id: 2,
    gonulluluk_no: 'G0123456792',
    name: 'Zehra',
    surname: 'Kılıç',
    email: 'zehra.kilic@email.com',
    phone: '+90 533 234 5678',
    city: 'İzmir',
    joinDate: '2024-02-20T00:00:00.000Z',
    volunteerType: 'toplama',
  },
  {
    id: 3,
    gonulluluk_no: 'G0123456795',
    name: 'Osman',
    surname: 'Çelik',
    email: 'osman.celik@email.com',
    phone: '+90 534 345 6789',
    city: 'İstanbul',
    joinDate: '2023-11-10T00:00:00.000Z',
    volunteerType: 'toplama',
  },
  {
    id: 4,
    gonulluluk_no: 'G0123456799',
    name: 'Selin',
    surname: 'Demir',
    email: 'selin.demir@email.com',
    phone: '+90 535 456 7890',
    city: 'Bursa',
    joinDate: '2024-03-05T00:00:00.000Z',
    volunteerType: 'toplama',
  },
  {
    id: 5,
    gonulluluk_no: 'G0123456803',
    name: 'Emre',
    surname: 'Yıldırım',
    email: 'emre.yildirim@email.com',
    phone: '+90 536 567 8901',
    city: 'Antalya',
    joinDate: '2024-04-12T00:00:00.000Z',
    volunteerType: 'toplama',
  },
  {
    id: 6,
    gonulluluk_no: 'G0123456806',
    name: 'Ayşe',
    surname: 'Güler',
    email: 'ayse.guler@email.com',
    phone: '+90 537 678 9012',
    city: 'Gaziantep',
    joinDate: '2024-05-18T00:00:00.000Z',
    volunteerType: 'toplama',
  },
  {
    id: 7,
    gonulluluk_no: 'G0123456808',
    name: 'Cemil',
    surname: 'Başaran',
    email: 'cemil.basaran@email.com',
    phone: '+90 538 789 0123',
    city: 'Adana',
    joinDate: '2024-06-25T00:00:00.000Z',
    volunteerType: 'toplama',
  },
  {
    id: 8,
    gonulluluk_no: 'G0123456809',
    name: 'Deniz',
    surname: 'Korkmaz',
    email: 'deniz.korkmaz@email.com',
    phone: '+90 539 890 1234',
    city: 'Trabzon',
    joinDate: '2024-07-30T00:00:00.000Z',
    volunteerType: 'toplama',
  },
  
  // Taşıma görevlileri
  {
    id: 9,
    gonulluluk_no: 'G0123456790',
    name: 'Serkan',
    surname: 'Acar',
    email: 'serkan.acar@email.com',
    phone: '+90 540 901 2345',
    city: 'Ankara',
    joinDate: '2024-01-20T00:00:00.000Z',
    volunteerType: 'taşıma',
  },
  {
    id: 10,
    gonulluluk_no: 'G0123456796',
    name: 'Mustafa',
    surname: 'Kara',
    email: 'mustafa.kara@email.com',
    phone: '+90 541 012 3456',
    city: 'İstanbul',
    joinDate: '2024-02-14T00:00:00.000Z',
    volunteerType: 'taşıma',
  },
  {
    id: 11,
    gonulluluk_no: 'G0123456800',
    name: 'Oğuz',
    surname: 'Şahin',
    email: 'oguz.sahin@email.com',
    phone: '+90 542 123 4567',
    city: 'Bursa',
    joinDate: '2024-03-10T00:00:00.000Z',
    volunteerType: 'taşıma',
  },
  {
    id: 12,
    gonulluluk_no: 'G0123456804',
    name: 'Burak',
    surname: 'Öztürk',
    email: 'burak.ozturk@email.com',
    phone: '+90 543 234 5678',
    city: 'Antalya',
    joinDate: '2024-04-22T00:00:00.000Z',
    volunteerType: 'taşıma',
  },
  {
    id: 13,
    gonulluluk_no: 'G0123456810',
    name: 'Mert',
    surname: 'Özgür',
    email: 'mert.ozgur@email.com',
    phone: '+90 544 345 6789',
    city: 'Trabzon',
    joinDate: '2024-08-05T00:00:00.000Z',
    volunteerType: 'taşıma',
  },
  
  // Dağıtım görevlileri
  {
    id: 14,
    gonulluluk_no: 'G0123456793',
    name: 'Hüseyin',
    surname: 'Arslan',
    email: 'huseyin.arslan@email.com',
    phone: '+90 545 456 7890',
    city: 'İzmir',
    joinDate: '2024-02-28T00:00:00.000Z',
    volunteerType: 'dağıtım',
  },
  {
    id: 15,
    gonulluluk_no: 'G0123456797',
    name: 'Elif',
    surname: 'Yıldız',
    email: 'elif.yildiz@email.com',
    phone: '+90 546 567 8901',
    city: 'İstanbul',
    joinDate: '2024-03-15T00:00:00.000Z',
    volunteerType: 'dağıtım',
  },
  {
    id: 16,
    gonulluluk_no: 'G0123456801',
    name: 'Aylin',
    surname: 'Çelik',
    email: 'aylin.celik@email.com',
    phone: '+90 547 678 9012',
    city: 'Bursa',
    joinDate: '2024-04-08T00:00:00.000Z',
    volunteerType: 'dağıtım',
  },
  
  // Karma görevliler (birden fazla alanda çalışabilir)
  {
    id: 17,
    gonulluluk_no: 'G0123456811',
    name: 'Fatma',
    surname: 'Koç',
    email: 'fatma.koc@email.com',
    phone: '+90 548 789 0123',
    city: 'Ankara',
    joinDate: '2023-12-10T00:00:00.000Z',
    volunteerType: 'karma',
  },
  {
    id: 18,
    gonulluluk_no: 'G0123456812',
    name: 'Mehmet',
    surname: 'Yılmaz',
    email: 'mehmet.yilmaz@email.com',
    phone: '+90 549 890 1234',
    city: 'İzmir',
    joinDate: '2024-01-05T00:00:00.000Z',
    volunteerType: 'karma',
  },
  {
    id: 19,
    gonulluluk_no: 'G0123456813',
    name: 'Zeynep',
    surname: 'Aktaş',
    email: 'zeynep.aktas@email.com',
    phone: '+90 550 901 2345',
    city: 'İstanbul',
    joinDate: '2024-02-12T00:00:00.000Z',
    volunteerType: 'karma',
  },
  {
    id: 20,
    gonulluluk_no: 'G0123456814',
    name: 'Can',
    surname: 'Polat',
    email: 'can.polat@email.com',
    phone: '+90 551 012 3456',
    city: 'Bursa',
    joinDate: '2024-03-20T00:00:00.000Z',
    volunteerType: 'karma',
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

  if (!volunteer.gonulluluk_no) {
    issues = [...issues, { message: 'Gönüllülük numarası zorunludur', path: ['gonulluluk_no'] }];
  } else if (!/^G\d{10}$/.test(volunteer.gonulluluk_no)) {
    issues = [...issues, { message: 'Gönüllülük numarası G ile başlamalı ve 10 haneli olmalıdır (örn: G0123456789)', path: ['gonulluluk_no'] }];
  }

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

  if (!volunteer.volunteerType) {
    issues = [...issues, { message: 'Gönüllü tipi zorunludur', path: ['volunteerType'] }];
  }

  return { issues };
}
