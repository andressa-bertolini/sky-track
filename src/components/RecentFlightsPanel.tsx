import './RecentFlights.css';

type Flight = {
  id: string;
  origin: string;
  destination: string;
  departure: string;
  status: 'on time' | 'delayed' | 'cancelled';
};

const mockFlights: Flight[] = [
  {
    id: 'SK123',
    origin: 'São Paulo (GRU)',
    destination: 'New York (JFK)',
    departure: '2025-06-05T14:00:00Z',
    status: 'on time',
  },
  {
    id: 'SK456',
    origin: 'Rio de Janeiro (GIG)',
    destination: 'Lisbon (LIS)',
    departure: '2025-06-05T16:30:00Z',
    status: 'delayed',
  },
  {
    id: 'SK124',
    origin: 'São Paulo (GRU)',
    destination: 'New York (JFK)',
    departure: '2025-06-05T14:00:00Z',
    status: 'on time',
  },
  {
    id: 'SK457',
    origin: 'Rio de Janeiro (GIG)',
    destination: 'Lisbon (LIS)',
    departure: '2025-06-05T16:30:00Z',
    status: 'delayed',
  },
  {
    id: 'SK125',
    origin: 'São Paulo (GRU)',
    destination: 'New York (JFK)',
    departure: '2025-06-05T14:00:00Z',
    status: 'on time',
  },
  {
    id: 'SK458',
    origin: 'Rio de Janeiro (GIG)',
    destination: 'Lisbon (LIS)',
    departure: '2025-06-05T16:30:00Z',
    status: 'delayed',
  },
  {
    id: 'SK133',
    origin: 'São Paulo (GRU)',
    destination: 'New York (JFK)',
    departure: '2025-06-05T14:00:00Z',
    status: 'on time',
  },
  {
    id: 'SK466',
    origin: 'Rio de Janeiro (GIG)',
    destination: 'Lisbon (LIS)',
    departure: '2025-06-05T16:30:00Z',
    status: 'delayed',
  },
];

export default function RecentFlightsPanel() {
  return (
    <div className="recent-flights">
      <h2 className="text-xl font-semibold mb-2">Recent Flights</h2>
      <ul className="recent-flights-container scrollbar-dark-thin space-y-3 pr-1">
        {mockFlights.map((flight) => (
          <li
            key={flight.id}
            className="bg-black-70 border border-gray-200 rounded-lg p-4"
          >
            <p className="font-medium">{flight.origin} → {flight.destination}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Departure: {new Date(flight.departure).toLocaleString()}</p>
              </div>
              <span
                className={`text-xs font-semibold px-3 mt-[5px] py-1 rounded-full ${
                  flight.status === 'on time' ? 'bg-green-100 text-green-800'
                  : flight.status === 'delayed' ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
                }`}
              >
                {flight.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}