import { Table } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';

import PopOver from '../../components/shared/PopOver.jsx';
import Translations from '../../translations/en/profile.json';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function DonationHistory() {
    const [donations, setDonations] = useState([]);
    const [totalDonation, setTotalDonation] = useState(0.0);
    const [totalGifts, setTotalGifts] = useState(0);
    const dateConfig = { year: 'numeric', month: 'short', day: '2-digit' };

    useEffect(() => {
        const fetchDonations = () => {
            axios.get('/api/profile/donations').then((res) => {
                if (res.data && res.data.data) {
                    setDonations(res.data.data);
                }
            });
        };
        fetchDonations();
    }, []);

    useEffect(() => {
        if (donations) {
            setTotalGifts(donations.length);
            donations.forEach((data) => {
                if (data?.donationPrice) {
                    setTotalDonation(prev => prev + data?.donationPrice);
                }
            });
        }
    }, [donations]);

    return (
        <MantineProviderWrapper>
            <div className="container mt-3" id="donation-history">
                <div className="row p-4">
                    <div className="col-md-4">
                        <div className="card rounded shadow">
                            <div className="card-body d-flex justify-content-around align-items-center">
                                <div>
                                    <i className="fas fa-hand-holding-usd"></i>
                                </div>
                                <div className="border-left px-4">
                                    <h1>
                                        $
                                        {totalDonation}
                                    </h1>
                                    <p>
                                        your total donation amount
                                        {' '}
                                        <PopOver
                                            text={
                                                Translations.DONATION_HISTORY.totalDonation
                                                    .popOverText
                                            }
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card rounded shadow">
                            <div className="card-body d-flex justify-content-around align-items-center">
                                <div>
                                    <i className="fas fa-gifts"></i>
                                </div>
                                <div className="border-left px-4">
                                    <h1>{totalGifts}</h1>
                                    <p>gifts donated from you</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card rounded shadow">
                            <div className="card-body d-flex justify-content-around align-items-center">
                                <div>
                                    <i className="fas fa-crown"></i>
                                </div>
                                <div className="border-left px-4">
                                    <h1>{10 + Math.ceil(totalDonation * 2)}</h1>
                                    <p>
                                        donation karma points
                                        {' '}
                                        <PopOver
                                            text={
                                                Translations.DONATION_HISTORY.karmaPoints
                                                    .popOverText
                                            }
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Table className="my-5 pb-2" striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Donated to</Table.Th>
                            <Table.Th>Item Price</Table.Th>
                            <Table.Th>Item Name</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {donations.length > 1 ?
                            donations.map(data => (
                                <Table.Tr key={data?._id}>
                                    <Table.Td>
                                        {data?.donationCard?.childFirstName || ''}
                                    </Table.Td>
                                    <Table.Td>
                                        $
                                        {data?.donationCard?.wishItemPrice || ''}
                                    </Table.Td>
                                    <Table.Td>
                                        {data?.donationCard?.wishItemName || ''}
                                    </Table.Td>
                                    <Table.Td>
                                        {data?.donationDate &&
                                                new Date(data?.donationDate).toLocaleDateString(
                                                    'en-US',
                                                    dateConfig,
                                                )}
                                    </Table.Td>
                                    <Table.Td>{data?.status || ''}</Table.Td>
                                </Table.Tr>
                            )) :
                            null}
                    </Table.Tbody>
                </Table>
                {!donations.length ?
                    (
                        <p className="d-flex justify-content-center">
                            {Translations.DONATION_HISTORY.noRecords}
                        </p>
                    ) :
                    null}
            </div>
        </MantineProviderWrapper>
    );
}

export default DonationHistory;
