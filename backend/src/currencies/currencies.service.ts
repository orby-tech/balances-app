import { CurrenciesRate } from '@common/graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrenciesService {
  async getLatest(): Promise<CurrenciesRate> {
    return {
      meta: {
        last_updated_at: '2023-03-31T23:59:59Z',
      },
      data: [
        {
          code: 'ADA',
          value: 2.501983,
        },
        {
          code: 'AED',
          value: 3.672707,
        },
        {
          code: 'AFN',
          value: 86.756286,
        },
        {
          code: 'ALL',
          value: 104.30012,
        },
        {
          code: 'AMD',
          value: 388.480425,
        },
        {
          code: 'ANG',
          value: 1.79824,
        },
        {
          code: 'AOA',
          value: 507.500704,
        },
        {
          code: 'ARS',
          value: 208.389926,
        },
        {
          code: 'AUD',
          value: 1.495252,
        },
        {
          code: 'AVAX',
          value: 0.056297,
        },
        {
          code: 'AWG',
          value: 1.800003,
        },
        {
          code: 'AZN',
          value: 1.700002,
        },
        {
          code: 'BAM',
          value: 1.795534,
        },
        {
          code: 'BBD',
          value: 2.014765,
        },
        {
          code: 'BDT',
          value: 107.017791,
        },
        {
          code: 'BGN',
          value: 1.796847,
        },
        {
          code: 'BHD',
          value: 0.376561,
        },
        {
          code: 'BIF',
          value: 2085.003668,
        },
        {
          code: 'BMD',
          value: 1.000002,
        },
        {
          code: 'BNB',
          value: 0.003129,
        },
        {
          code: 'BND',
          value: 1.327601,
        },
        {
          code: 'BOB',
          value: 6.895299,
        },
        {
          code: 'BRL',
          value: 5.063307,
        },
        {
          code: 'BSD',
          value: 0.997835,
        },
        {
          code: 'BTC',
          value: 3.5e-5,
        },
        {
          code: 'BTN',
          value: 82.027456,
        },
        {
          code: 'BWP',
          value: 13.009764,
        },
        {
          code: 'BYN',
          value: 2.518651,
        },
        {
          code: 'BYR',
          value: 19600,
        },
        {
          code: 'BZD',
          value: 2.011369,
        },
        {
          code: 'CAD',
          value: 1.352652,
        },
        {
          code: 'CDF',
          value: 2046.002072,
        },
        {
          code: 'CHF',
          value: 0.914866,
        },
        {
          code: 'CLF',
          value: 0.028663,
        },
        {
          code: 'CLP',
          value: 790.911012,
        },
        {
          code: 'CNY',
          value: 6.868812,
        },
        {
          code: 'COP',
          value: 4654.635976,
        },
        {
          code: 'CRC',
          value: 539.531569,
        },
        {
          code: 'CUC',
          value: 1.004954,
        },
        {
          code: 'CUP',
          value: 23.948393,
        },
        {
          code: 'CVE',
          value: 101.570129,
        },
        {
          code: 'CZK',
          value: 21.645524,
        },
        {
          code: 'DJF',
          value: 177.720301,
        },
        {
          code: 'DKK',
          value: 6.871114,
        },
        {
          code: 'DOP',
          value: 54.800094,
        },
        {
          code: 'DOT',
          value: 0.156792,
        },
        {
          code: 'DZD',
          value: 135.917145,
        },
        {
          code: 'EGP',
          value: 30.710543,
        },
        {
          code: 'ERN',
          value: 15.000029,
        },
        {
          code: 'ETB',
          value: 53.900089,
        },
        {
          code: 'ETH',
          value: 0.000547,
        },
        {
          code: 'EUR',
          value: 0.919901,
        },
        {
          code: 'FJD',
          value: 2.210504,
        },
        {
          code: 'FKP',
          value: 0.810162,
        },
        {
          code: 'GBP',
          value: 0.810111,
        },
        {
          code: 'GEL',
          value: 2.550005,
        },
        {
          code: 'GGP',
          value: 0.810162,
        },
        {
          code: 'GHS',
          value: 11.650019,
        },
        {
          code: 'GIP',
          value: 0.810162,
        },
        {
          code: 'GMD',
          value: 62.150081,
        },
        {
          code: 'GNF',
          value: 8650.016046,
        },
        {
          code: 'GTQ',
          value: 7.782673,
        },
        {
          code: 'GYD',
          value: 211.020458,
        },
        {
          code: 'HKD',
          value: 7.849965,
        },
        {
          code: 'HNL',
          value: 24.660034,
        },
        {
          code: 'HRK',
          value: 6.930994,
        },
        {
          code: 'HTG',
          value: 154.66487,
        },
        {
          code: 'HUF',
          value: 350.480447,
        },
        {
          code: 'IDR',
          value: 14968.67532,
        },
        {
          code: 'ILS',
          value: 3.600457,
        },
        {
          code: 'IMP',
          value: 0.810162,
        },
        {
          code: 'INR',
          value: 82.180852,
        },
        {
          code: 'IQD',
          value: 1460.001788,
        },
        {
          code: 'IRR',
          value: 42275.073827,
        },
        {
          code: 'ISK',
          value: 137.34021,
        },
        {
          code: 'JEP',
          value: 0.810163,
        },
        {
          code: 'JMD',
          value: 150.642407,
        },
        {
          code: 'JOD',
          value: 0.709401,
        },
        {
          code: 'JPY',
          value: 132.775194,
        },
        {
          code: 'KES',
          value: 132.500239,
        },
        {
          code: 'KGS',
          value: 87.420136,
        },
        {
          code: 'KHR',
          value: 4052.004959,
        },
        {
          code: 'KMF',
          value: 452.37567,
        },
        {
          code: 'KPW',
          value: 899.988485,
        },
        {
          code: 'KRW',
          value: 1306.472031,
        },
        {
          code: 'KWD',
          value: 0.30684,
        },
        {
          code: 'KYD',
          value: 0.831575,
        },
        {
          code: 'KZT',
          value: 454.823277,
        },
        {
          code: 'LAK',
          value: 17005.02574,
        },
        {
          code: 'LBP',
          value: 15037.126719,
        },
        {
          code: 'LKR',
          value: 329.000353,
        },
        {
          code: 'LRD',
          value: 162.300312,
        },
        {
          code: 'LSL',
          value: 17.730029,
        },
        {
          code: 'LTC',
          value: 0.011081,
        },
        {
          code: 'LTL',
          value: 2.95274,
        },
        {
          code: 'LVL',
          value: 0.60489,
        },
        {
          code: 'LYD',
          value: 4.780009,
        },
        {
          code: 'MAD',
          value: 10.224013,
        },
        {
          code: 'MATIC',
          value: 0.892323,
        },
        {
          code: 'MDL',
          value: 18.304097,
        },
        {
          code: 'MGA',
          value: 4345.008428,
        },
        {
          code: 'MKD',
          value: 56.561418,
        },
        {
          code: 'MMK',
          value: 2095.46313,
        },
        {
          code: 'MNT',
          value: 3525.933547,
        },
        {
          code: 'MOP',
          value: 8.06739,
        },
        {
          code: 'MRO',
          value: 356.999828,
        },
        {
          code: 'MUR',
          value: 45.450081,
        },
        {
          code: 'MVR',
          value: 15.350022,
        },
        {
          code: 'MWK',
          value: 1022.501754,
        },
        {
          code: 'MXN',
          value: 18.017035,
        },
        {
          code: 'MYR',
          value: 4.412507,
        },
        {
          code: 'MZN',
          value: 63.100121,
        },
        {
          code: 'NAD',
          value: 17.730027,
        },
        {
          code: 'NGN',
          value: 464.50051,
        },
        {
          code: 'NIO',
          value: 36.575061,
        },
        {
          code: 'NOK',
          value: 10.501519,
        },
        {
          code: 'NPR',
          value: 131.243589,
        },
        {
          code: 'NZD',
          value: 1.597703,
        },
        {
          code: 'OMR',
          value: 0.384559,
        },
        {
          code: 'PAB',
          value: 0.997835,
        },
        {
          code: 'PEN',
          value: 3.763007,
        },
        {
          code: 'PGK',
          value: 3.520005,
        },
        {
          code: 'PHP',
          value: 54.292596,
        },
        {
          code: 'PKR',
          value: 283.800403,
        },
        {
          code: 'PLN',
          value: 4.316155,
        },
        {
          code: 'PYG',
          value: 7134.604871,
        },
        {
          code: 'QAR',
          value: 3.641006,
        },
        {
          code: 'RON',
          value: 4.563608,
        },
        {
          code: 'RSD',
          value: 108.220203,
        },
        {
          code: 'RUB',
          value: 78.000119,
        },
        {
          code: 'RWF',
          value: 1108.700688,
        },
        {
          code: 'SAR',
          value: 3.752327,
        },
        {
          code: 'SBD',
          value: 8.232271,
        },
        {
          code: 'SCR',
          value: 13.929898,
        },
        {
          code: 'SDG',
          value: 597.001082,
        },
        {
          code: 'SEK',
          value: 10.378518,
        },
        {
          code: 'SGD',
          value: 1.330802,
        },
        {
          code: 'SHP',
          value: 1.216752,
        },
        {
          code: 'SLL',
          value: 19750.023963,
        },
        {
          code: 'SOL',
          value: 0.0472,
        },
        {
          code: 'SOS',
          value: 568.500745,
        },
        {
          code: 'SRD',
          value: 36.097542,
        },
        {
          code: 'STD',
          value: 20697.981008,
        },
        {
          code: 'SVC',
          value: 8.731548,
        },
        {
          code: 'SYP',
          value: 2511.935325,
        },
        {
          code: 'SZL',
          value: 17.73002,
        },
        {
          code: 'THB',
          value: 34.080058,
        },
        {
          code: 'TJS',
          value: 10.901437,
        },
        {
          code: 'TMT',
          value: 3.490005,
        },
        {
          code: 'TND',
          value: 3.048505,
        },
        {
          code: 'TOP',
          value: 2.350603,
        },
        {
          code: 'TRY',
          value: 19.178222,
        },
        {
          code: 'TTD',
          value: 6.773293,
        },
        {
          code: 'TWD',
          value: 30.540153,
        },
        {
          code: 'TZS',
          value: 2338.858531,
        },
        {
          code: 'UAH',
          value: 36.67173,
        },
        {
          code: 'UGX',
          value: 3762.191142,
        },
        {
          code: 'USD',
          value: 1,
        },
        {
          code: 'UYU',
          value: 38.806232,
        },
        {
          code: 'UZS',
          value: 11415.015621,
        },
        {
          code: 'VEF',
          value: 2444127.03853,
        },
        {
          code: 'VND',
          value: 23465.024356,
        },
        {
          code: 'VUV',
          value: 118.172598,
        },
        {
          code: 'WST',
          value: 2.684993,
        },
        {
          code: 'XAF',
          value: 602.239177,
        },
        {
          code: 'XAG',
          value: 0.041486,
        },
        {
          code: 'XAU',
          value: 0.000508,
        },
        {
          code: 'XCD',
          value: 2.702555,
        },
        {
          code: 'XDR',
          value: 0.743798,
        },
        {
          code: 'XOF',
          value: 601.001174,
        },
        {
          code: 'XPF',
          value: 110.200206,
        },
        {
          code: 'XRP',
          value: 1.846593,
        },
        {
          code: 'YER',
          value: 250.350399,
        },
        {
          code: 'ZAR',
          value: 17.793888,
        },
        {
          code: 'ZMK',
          value: 9001.2,
        },
        {
          code: 'ZMW',
          value: 21.178956,
        },
        {
          code: 'ZWL',
          value: 321.999592,
        },
      ],
    };
  }
}
