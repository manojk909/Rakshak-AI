'use client';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const CONTACTS = [
  { state: 'Andaman & Nicobar', nodal: { name: 'Sh. Jitendra Kumar Meena, IPS', rank: 'SSP (CID)', email: 'spcid.and@nic.in' }, grievance: { name: 'Smt. Sindhu Pillai A, IPS', rank: 'DIGP(Intl.)', contact: '03192-232334', email: 'igp.and@nic.in' }},
  { state: 'Andhra Pradesh', nodal: { name: 'Sh. Adhiraj Singh Rana', rank: 'IPS, SP Cyber Crimes, CID', email: 'cybercrimes1930@cid.appolice.gov.in' }, grievance: { name: 'SP Cyber Crimes, CID', rank: 'Superintendent of Police', contact: '0863-2340559', email: 'cybercrimes-cid@ap.gov.in' }},
  { state: 'Arunachal Pradesh', nodal: { name: 'Sh Shivendu Bhushan', rank: 'IPS', email: 'spsit@arunpol.nic.in' }, grievance: { name: 'Sh. Take Ringu, IPS', rank: 'IGP (Crime)', contact: '9436040703', email: 'takeringu@ips.gov.in' }},
  { state: 'Assam', nodal: { name: 'Sh. Saurav Jyoti Saikia', rank: 'APS, SP Cyber Crime-2, CID', email: 'sp-cid-cyber2@assampolice.gov.in' }, grievance: { name: 'Sh. Debaraj Upadhaya, IPS', rank: 'IGP, CID', contact: '0361-2521618', email: 'igp-cid@assampolice.gov.in' }},
  { state: 'Bihar', nodal: { name: 'Shri. Sushil Kumar IPS', rank: 'SP', email: 'cybercell-bih@nic.in' }, grievance: { name: 'Shri. Rajesh Tripathi', rank: 'SSP', contact: '0612-2238098', email: 'cybercell-bih@nic.in' }},
  { state: 'Chandigarh', nodal: { name: 'Ms. Geetanjali', rank: 'SP, Cyber Crime', email: 'spops-chd@nic.in' }, grievance: { name: 'Sh. Raj Kumar Singh, IPS', rank: 'IGP-UT', contact: '0172-2700056', email: 'dig-chd@nic.in' }},
  { state: 'Chhattisgarh', nodal: { name: 'Sh. Kavi Gupta', rank: 'AIG', email: 'aigtech-phq.cg@gov.in' }, grievance: { name: 'Shri Girija Shankar Jaiswal', rank: 'DIG (Technical Services)', contact: '0771-2511989', email: 'girijashankar.ips@gov.in' }},
  { state: 'Dadra & Nagar Haveli and Daman & Diu', nodal: { name: 'Sh. Ketan Bansal', rank: 'IPS', email: 'sp-dmn-dd@nic.in' }, grievance: { name: 'Sh. Vikramjit Singh, IPS', rank: 'DIGP', contact: '0260-2220140', email: 'digp-daman-dd@nic.in' }},
  { state: 'Delhi', nodal: { name: 'Sh. Vinit Kumar, IPS', rank: 'DCP/IFSO', email: 'dcp-ifso@delhipolice.gov.in' }, grievance: { name: 'Sh. Rajneesh Gupta IPS', rank: 'JT.CP, IFSO Special Cell', contact: '011-20892633', email: 'jointcp.ifsosplcell@delhipolice.gov.in' }},
  { state: 'Goa', nodal: { name: 'Shri Rajendra Raut Dessai', rank: 'SP, Cyber Crime', email: 'spcyber@goapolice.gov.in' }, grievance: { name: 'Sh. Paramaditya', rank: 'DIGP', contact: '0832-2420883', email: 'digpgoa@goapolice.gov.in' }},
  { state: 'Gujarat', nodal: { name: 'Shri. Vivek Bheda', rank: 'Superintendent of Police', email: 'cc-cid@gujarat.gov.in' }, grievance: { name: 'Sh. S.G. Trivedi', rank: 'IGP', contact: '079-23250798', email: 'cc-cid@gujarat.gov.in' }},
  { state: 'Haryana', nodal: { name: 'Sh. Sibash Kabiraj', rank: 'IPS, ADGP Cyber Haryana', email: 'sp-cybercrimephq.pol@hry.gov.in' }, grievance: { name: 'Sh. Mayank Gupta', rank: 'SP', contact: '0172-2524058', email: 'sp-cybercrimephq.pol@hry.gov.in' }},
  { state: 'Himachal Pradesh', nodal: { name: 'IPS Mohit Chawla', rank: 'DIG', email: 'dig-cybercr-hp@nic.in' }, grievance: { name: 'Sh. D. K. Chaudhary', rank: 'DIGP/Crime', contact: '0177-2620331', email: 'adgp-cid-hp@nic.in' }},
  { state: 'Jammu & Kashmir', nodal: { name: 'Sh. Ramnesh Gupta', rank: 'JEPS, SSP CICE J&K', email: 'ssp-cicejk@jkpolice.gov.in' }, grievance: { name: 'Sh. RR Swan', rank: 'DGP', contact: '0191-25822926', email: 'adgpcidjk@jkpolice.gov.in' }},
  { state: 'Jharkhand', nodal: { name: 'Sh. Ehtesham Waquarib', rank: 'IPS, SP, CID', email: 'sp-cid@jhpolice.gov.in' }, grievance: { name: 'SP Cyber Crime, CID', rank: 'SP', contact: '0651-2220060', email: 'cyberps@jhpolice.gov.in' }},
  { state: 'Karnataka', nodal: { name: 'Sh. S Ravi', rank: 'ADGP/Intl.', email: 'spctrcid@ksp.gov.in' }, grievance: { name: 'Sri Shantanu Sinha, IPS', rank: 'DIG, Cyber Crimes, Narcotic, CID', contact: '080-22942475', email: 'spctrcid@ksp.gov.in' }},
  { state: 'Kerala', nodal: { name: 'Sh. Ankit Ashokan', rank: 'IPS, SP Cyber Crime', email: 'spcyberops.pol@kerala.gov.in' }, grievance: { name: 'Sh H Venkatesh, IPS', rank: 'ADGP', contact: '0471-2300042', email: 'adgpcyberops.pol@kerala.gov.in' }},
  { state: 'Ladakh', nodal: { name: 'Sh. Altaf Ahmad Shah', rank: 'IPS, SSP', email: 'soto-igp@police.ladakh.gov.in' }, grievance: { name: 'Sh. Deepak Digra, JKPS', rank: 'SP (AIG CIV PHQ UT Ladakh)', contact: '9541902324', email: 'aig-civl@police.ladakh.gov.in' }},
  { state: 'Lakshadweep', nodal: { name: 'Sh. Utkarsha', rank: 'IPS, SP Cyber Crime', email: 'lak-sop@nic.in' }, grievance: { name: 'Sh. Hareshwar V Swami, IPS', rank: 'SP (L&O)', contact: '04896262258', email: 'lak-sop@nic.in' }},
  { state: 'Madhya Pradesh', nodal: { name: 'Sh. Shiyas A', rank: 'IG Cyber', email: 'dig2-cybercell@mppolice.gov.in' }, grievance: { name: 'Shri Shiyas A', rank: 'DIG Cyber', contact: '', email: 'dig2-cybercell@mppolice.gov.in' }},
  { state: 'Maharashtra', nodal: { name: 'Sh. Sanjay Shintre', rank: 'DIG Cyber Crime Maharashtra', email: 'dig.cbr-mah@gov.in' }, grievance: { name: 'Sh. Sanjay Vilas Shintre', rank: 'SP', contact: '022-22160080', email: 'sp.cbr-mah@gov.in' }},
  { state: 'Manipur', nodal: { name: 'Shri N. John', rank: 'Superintendent of Police', email: 'sp-cybercrime.mn@manipur.gov.in' }, grievance: { name: 'Sh. Ningshem Worngam', rank: 'DIGP (Int)', contact: '0385-2444888', email: 'grievance.ncrp@gmail.com' }},
  { state: 'Meghalaya', nodal: { name: 'Shri Basant Kumar Mishra, MPS', rank: 'DSP', email: 'ccw-meg@gov.in' }, grievance: { name: 'Shri Dheeraj Yadav, IPS', rank: 'SP (Cyber)', contact: '9402519391', email: 'ccw-meg@gov.in' }},
  { state: 'Mizoram', nodal: { name: 'Sh. Zonun Sanga', rank: 'MPS', email: 'cybercrime.sp@mizoram.gov.in' }, grievance: { name: 'Sh Devesh Chandra Srivastava, IPS', rank: 'DGP', contact: '0389-2334682', email: 'polmizo@rediffmail.com' }},
  { state: 'Nagaland', nodal: { name: 'Sh. Vikram M Khalate', rank: 'IPS, IGP CID', email: 'spcyber-ngl@gov.in' }, grievance: { name: 'Sh. Sandeep M. Tamgadge, IPS', rank: 'ADGP (L&O)', contact: '6009308003', email: 'adgplo.ngl@gov.in' }},
  { state: 'Odisha', nodal: { name: 'Shri. Shefeen Ahamed K, IPS', rank: 'IGP, CID CB', email: 'igp2-cidcb@odishapolice.gov.in' }, grievance: { name: 'Sh. Arun Bothra, IPS', rank: 'ADGP', contact: '0674-2913100', email: 'adgcidcb.orpol@nic.in' }},
  { state: 'Puducherry', nodal: { name: 'Ms. Shruti Yaragatti', rank: 'IPS SP Cyber Crime', email: 'cybercell-police.py@gov.in' }, grievance: { name: 'Sh. Dr. VJ Chandran', rank: 'IGP', contact: '0413-2231313', email: 'igp@py.gov.in' }},
  { state: 'Punjab', nodal: { name: 'Jashandeep Singh Gill', rank: 'Superintendent of Police', email: 'aigcc@punjabpolice.gov.in' }, grievance: { name: 'Sh. P. K. Sinha, IPS', rank: 'ADGP, Cyber Crime', contact: '0172-2226258', email: 'igp.cyber.c.police@punjabpolice.gov.in' }},
  { state: 'Rajasthan', nodal: { name: 'Shri Shantanu Kumar Singh', rank: 'Superintendent of Police', email: 'sp.cybercrime@rajpolice.gov.in' }, grievance: { name: 'Shri Sharat Kaviraj', rank: 'Inspector General of Police', contact: '01412821741', email: 'sp.cybercrime@rajpolice.gov.in' }},
  { state: 'Sikkim', nodal: { name: 'Sh. Tenzing Loden Lepcha', rank: 'IPS, DIGP CB-CID', email: 'spcid@sikkimpolice.nic.in' }, grievance: { name: 'Sh. Abhishek Dahal', rank: 'Police Inspector/CID', contact: '9046245066', email: 'cybercrime666sk@gmail.com' }},
  { state: 'Tamil Nadu', nodal: { name: 'Ms. Shahnaz Illiyas', rank: 'Superintendent of Police Cyber', email: 'sp1-ccdtnpolice@gov.in' }, grievance: { name: 'Sh. D. Ashok Kumar', rank: 'SP (Other Cyber Crimes)', contact: '044-29580300', email: 'sp1-ccdtnpolice@gov.in' }},
  { state: 'Telangana', nodal: { name: 'Ms. B. Sai Sri', rank: 'SP TGCSB', email: 'spoperations-csb-ts@tspolice.gov.in' }, grievance: { name: 'Smt. Shikha Goel, IPS', rank: 'Director, TSCSB', contact: '040-29320049', email: 'director-tscsb@tspolice.gov.in' }},
  { state: 'Tripura', nodal: { name: 'Sh. Nabadwip Jamatia', rank: 'TPS', email: 'spcybercrime@tripurapolice.nic.in' }, grievance: { name: 'Smt. Sudeshna Bhattacharyya, TPS', rank: 'SP (SCRB)', contact: '0381-2376979', email: 'spscrb@tripurapolice.nic.in' }},
  { state: 'Uttarakhand', nodal: { name: 'Sh. Nilesh Anand Bharne', rank: 'IG Cyber Crime/STF', email: 'nileshanad.bharne@ips.gov.in' }, grievance: { name: 'Sh. Ayush Agarwal', rank: 'SSP/STF', contact: '0135-2655900', email: 'spstf-uk@nic.in' }},
  { state: 'Uttar Pradesh', nodal: { name: 'Sh. Rajesh Kumar', rank: 'SP, Cyber Crime', email: 'sp-cyber.lu@up.gov.in' }, grievance: { name: 'Binod Kumar Singh', rank: 'ADG', contact: '0522-2390538', email: 'adg-cybercrime.lu@up.gov.in' }},
  { state: 'West Bengal', nodal: { name: 'Sh. Suresh Kumar Chadive', rank: 'IPS, DIG Cyber Crime', email: 'dig1-ccw@policewb.gov.in' }, grievance: { name: 'Shri Sanjay Singh, IPS', rank: 'DG & IGP, Cyber Crime Wing', contact: '033-22021200', email: 'ncrp-ccw@policewb.gov.in' }},
];

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = CONTACTS.filter((contact) =>
    contact.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-obsidian min-h-screen text-white pt-24 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="mb-10 text-center">
          <h1 className="font-grotesk font-bold text-4xl md:text-5xl mb-4">State/UT Cyber Cell Directory</h1>
          <p className="text-white/60 text-lg">Report Generated by: National Cyber Crime Reporting Portal</p>
        </div>

        <div className="bg-[#ccff00] text-black font-bold p-4 rounded-xl text-center mb-12 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
          REPORT ONLINE FINANCIAL FRAUD AT THE NATIONAL CYBERCRIME HELPLINE NUMBER 1930
        </div>

        <div className="mb-12 relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search state/UT..."
            className="w-full bg-white/5 border border-white/20 rounded-full px-6 py-4 outline-none focus:border-[#ccff00] transition-colors pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all">
              <h2 className="font-grotesk font-bold text-2xl text-[#ccff00] mb-6">{contact.state}</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-white/50 font-mono mb-2 uppercase tracking-wider">Nodal Cyber Cell Officer</h3>
                  <div className="bg-black/40 rounded-lg p-3">
                    <p className="font-bold">{contact.nodal.name}</p>
                    <p className="text-sm text-white/70">{contact.nodal.rank}</p>
                    <p className="text-sm text-white/70 mt-1">✉️ {contact.nodal.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-white/50 font-mono mb-2 uppercase tracking-wider">Grievance Officer</h3>
                  <div className="bg-black/40 rounded-lg p-3">
                    <p className="font-bold">{contact.grievance.name}</p>
                    <p className="text-sm text-white/70">{contact.grievance.rank}</p>
                    {contact.grievance.contact && (
                      <p className="text-sm text-white/70 mt-1">📞 {contact.grievance.contact}</p>
                    )}
                    <p className="text-sm text-white/70 mt-1">✉️ {contact.grievance.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <div className="col-span-full text-center text-white/50 py-10">
              No contacts found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
