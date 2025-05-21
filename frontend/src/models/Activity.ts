export interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  image: File | string;
  address: {
    latitude: number;
    longitude: number;
  };
  scheduledDate: string;
  createdAt: string;
  completedAt: string | null;
  private: boolean;
  participants: number;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
}
