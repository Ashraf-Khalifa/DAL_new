import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FullAnalysisReport from './FullAnalysisReport';
import ViolationsScreen from './ViolationsScreen';

const StatusModal = ({ modalVisible, setModalVisible, navigation, loggedInUser, setShowForm }) => {
  const [showFullReport, setShowFullReport] = useState(false);
  const [showViolations, setShowViolations] = useState(false);

  const emailStatusMapping = {
    'admin@dal.com': {
      status: 'Good',
      score: '8/10',
      demand: 'Moderate',
      violations: 1,
      report: {
        overview: 'Amman city’s smart city system is functioning efficiently with advanced methods and features in place. Key metrics indicate stable performance and effective resource management.',
        details: 'Detailed analysis reveals moderate demand levels managed by robust infrastructure in Amman. The city leverages IoT devices for real-time data collection and employs AI for predictive maintenance. Violations are minimal, reflecting well-enforced regulations and compliance.',
      },
    },
    'superadmin@dal.com': {
      status: 'Excellent',
      score: '10/10',
      demand: 'Low',
      violations: 0,
      report: {
        overview: 'Amman city is performing exceptionally well, integrating cutting-edge technology to enhance urban living. All systems are operating within optimal parameters.',
        details: 'The detailed analysis showcases low demand in Amman due to efficient traffic management and energy utilization systems. AI and machine learning algorithms optimize city operations, resulting in zero violations and high citizen satisfaction.',
      },
    },
    'user1@dal.com': {
      status: 'Fair',
      score: '6/10',
      demand: 'High',
      violations: 3,
      report: {
        overview: 'Amman city is coping with high demand, employing several advanced methods to maintain service quality. Performance is fair but there are areas for improvement.',
        details: 'High demand in Amman is primarily due to peak hour congestion and resource usage. The city employs smart grids and adaptive traffic signals to mitigate these issues. However, a few violations indicate the need for better enforcement and optimization.',
      },
    },
    'user2@dal.com': {
      status: 'Poor',
      score: '4/10',
      demand: 'Very High',
      violations: 5,
      report: {
        overview: 'Amman city is under significant strain with numerous challenges in managing resources and services. Performance is below expectations, indicating critical areas needing attention.',
        details: 'Very high demand in Amman results in frequent congestion and resource shortages. The current methods, including smart water management and urban planning, are insufficient to handle the load. Multiple violations highlight the gaps in system enforcement and efficiency.',
      },
    },
    'user3@dal.com': {
      status: 'Critical',
      score: '2/10',
      demand: 'Overwhelming',
      violations: 10,
      report: {
        overview: 'Amman city is critically overloaded, facing major operational issues. Immediate intervention is required to prevent system collapse.',
        details: 'Overwhelming demand in Amman has led to critical failures in infrastructure and service delivery. Advanced methods like AI-driven traffic control and resource management are failing under the load. Numerous violations indicate widespread non-compliance and system breakdowns.',
      },
    },
    'user4@dal.com': {
      status: 'Good',
      score: '8/10',
      demand: 'Moderate',
      violations: 1,
      report: {
        overview: 'Amman city’s smart city system is operating efficiently with advanced methods and features. Performance metrics are stable, indicating good resource management.',
        details: 'Moderate demand in Amman is well-managed through the integration of IoT and AI technologies for real-time monitoring and predictive maintenance. The city infrastructure supports sustainable growth with minimal violations, reflecting effective regulation enforcement.',
      },
    },
    'user5@dal.com': {
      status: 'Excellent',
      score: '10/10',
      demand: 'Low',
      violations: 0,
      report: {
        overview: 'Amman city is performing at an optimal level, utilizing advanced technologies to enhance urban living standards. All systems are functioning perfectly.',
        details: 'Low demand in Amman is efficiently managed through automated systems and smart resource allocation. AI and machine learning are extensively used for operational optimization, leading to zero violations and high resident satisfaction.',
      },
    },
  };
  
  const userStatus = loggedInUser ? emailStatusMapping[loggedInUser.email] || { status: 'Unknown', score: 'N/A', demand: 'N/A', violations: 'N/A', report: {} } : { status: 'Unknown', score: 'N/A', demand: 'N/A', violations: 'N/A', report: {} };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalStatus}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {showFullReport ? (
              <FullAnalysisReport report={userStatus.report} onClose={() => setShowFullReport(false)} />
            ) : showViolations ? (
              <ViolationsScreen onClose={() => setShowViolations(false)} />
            ) : (
              <>
                <Text style={styles.welcomeText}>Welcome Amman Municipality,</Text>
                <Text style={styles.statusTitle}>Overall Curb status today is:</Text>
                <View style={styles.statusBox}>
                  <Text style={styles.statusText}>{userStatus.status}</Text>
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailText}>Overall score: {userStatus.score}</Text>
                  <Text style={styles.detailText}>Level of Demand: {userStatus.demand}</Text>
                  <Text style={styles.detailText}>No. of violations: {userStatus.violations}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => setShowFullReport(true)}>
                  <Text style={styles.buttonText}>VIEW THE FULL ANALYSIS REPORT</Text>
                  <Image source={require('../Images/report.png')} style={styles.buttonIcon} />
                </TouchableOpacity>
                {loggedInUser && loggedInUser.role !== 'user' && (
                  <>
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => {
                        setModalVisible(false);
                        setShowForm(true);
                      }}
                    >
                      <Text style={styles.buttonText}>MANAGE YOUR AREA</Text>
                      <Image source={require('../Images/manage.png')} style={styles.buttonIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => setShowViolations(true)}>
                      <Text style={styles.buttonText}>CHECK VIOLATIONS</Text>
                      <Image source={require('../Images/violations.png')} style={styles.buttonIcon} />
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalStatus: {
    width: wp('90%'),
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('5%'),
  },
  scrollContent: {
    alignItems: 'center',
    marginBottom: wp('2%'),
    marginTop: wp('2%'),
  },
  welcomeText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('1%'),
    color: '#000',
  },
  statusTitle: {
    fontSize: hp('2%'),
    textAlign: 'center',
    marginVertical: hp('1%'),
    color: '#000',
  },
  statusBox: {
    backgroundColor: 'green',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('10%'),
    borderRadius: wp('2%'),
    marginVertical: hp('1%'),
  },
  statusText: {
    color: '#fff',
    fontSize: hp('2%'),
    fontWeight: 'bold',

  },
  detailsContainer: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  detailText: {
    fontSize: hp('1.5%'),
    textAlign: 'center',
    marginVertical: hp('0.7%'),
    color: '#000',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('80%'),
    backgroundColor: '#12587B',
    padding: hp('1.5%'),
    borderRadius: wp('2%'),
    marginVertical: hp('1%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: hp('1.5%'),
    fontWeight: 'bold',
  },
  buttonIcon: {
    width: wp('6%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    width: wp('40%'),
    borderRadius: wp('2%'),
    backgroundColor: '#12587B',
    marginTop: hp('2%'),
  },
  closeButtonText: {
    color: '#fff',
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
});

export default StatusModal;
