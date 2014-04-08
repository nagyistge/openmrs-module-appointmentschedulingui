describe('AppointmentService tests', function() {

    OPENMRS_CONTEXT_PATH = '';     // mock openmrs_context_path global variable

    var mockAppointmentResources;
    var appointmentService;
    var q;

    var deferredAppointmentTypeQuery;
    var deferredTimeSlotQuery;
    var deferredAppointmentBlockQuery;
    var deferredAppointmentBlockSave;
    var deferredAppointmentBlockDelete;
    var deferredAppointmentQuery;
    var deferredAppointmentSave;
    var deferredScheduledAppointmentBlockQuery;


    beforeEach(module('appointmentscheduling.appointmentService'));

    // create mock AppointmentType resource
    var mockAppointmentType = jasmine.createSpyObj('AppointmentType', ['query']);
    mockAppointmentType.query.andCallFake(function() {

        deferredAppointmentTypeQuery = q.defer();

        var promise_mock = {
            $promise: deferredAppointmentTypeQuery.promise
        };

        return promise_mock;
    });

    // create mock TimeSlot resource
    var mockTimeSlot = jasmine.createSpyObj('TimeSlot', ['query']);
    mockTimeSlot.query.andCallFake(function() {

        deferredTimeSlotQuery = q.defer();

        var promise_mock = {
            $promise: deferredTimeSlotQuery.promise
        };

        return promise_mock;
    });

    // create mock AppointmentBlock resource
    var mockAppointmentBlock = jasmine.createSpyObj('AppointmentBlock', ['query', 'save', 'delete']);
    mockAppointmentBlock.query.andCallFake(function() {

        deferredAppointmentBlockQuery = q.defer();

        var promise_mock = {
            $promise: deferredAppointmentBlockQuery.promise
        }

        return promise_mock;
    })
    mockAppointmentBlock.save.andCallFake(function() {

        deferredAppointmentBlockSave = q.defer();

        var promise_mock = {
            $promise: deferredAppointmentBlockSave.promise
        }

        return promise_mock;
    })
    mockAppointmentBlock.delete.andCallFake(function() {

        deferredAppointmentBlockDelete = q.defer();

        var promise_mock = {
            $promise: deferredAppointmentBlockDelete.promise
        }

        return promise_mock;
    })


    // create mock Appointment resource
    var mockAppointment = jasmine.createSpyObj('Appointment', ['query','save']);
    mockAppointment.query.andCallFake(function() {

        deferredAppointmentQuery = q.defer();

        var promise_mock = {
            $promise: deferredAppointmentQuery.promise
        }

        return promise_mock;
    })
    mockAppointment.save.andCallFake(function() {

        deferredAppointmentSave = q.defer();

        var promise_mock = {
            $promise: deferredAppointmentSave.promise
        }

        return promise_mock;
    })

    var mockAppointmentAllowingOverbook = jasmine.createSpyObj('AppointmentAllowingOverbook', ['save']);
    mockAppointmentAllowingOverbook.save.andCallFake(function() {

        deferredAppointmentSave = q.defer();

        var promise_mock = {
            $promise: deferredAppointmentSave.promise
        }

        return promise_mock;
    })



    var mockScheduledAppointmentBlock = jasmine.createSpyObj('ScheduledAppointmentBlock', ['query']);
    mockScheduledAppointmentBlock.query.andCallFake(function () {

        deferredScheduledAppointmentBlockQuery = q.defer();

        var promise_mock = {
            $promise: deferredScheduledAppointmentBlockQuery.promise
        };

        return promise_mock;
    });

    beforeEach(module('appointmentscheduling.appointmentService'));

    beforeEach(module(function($provide) {
        $provide.value('AppointmentType', mockAppointmentType);
        $provide.value('TimeSlot', mockTimeSlot);
        $provide.value('Appointment', mockAppointment);
        $provide.value('AppointmentAllowingOverbook', mockAppointmentAllowingOverbook);
        $provide.value('AppointmentBlock', mockAppointmentBlock);
        $provide.value('ScheduledAppointmentBlock', mockScheduledAppointmentBlock);
    }));

    // inject necessary dependencies
    beforeEach(inject(function (_AppointmentService_,$q) {
        appointmentService = _AppointmentService_;
        q = $q;
    }));

    it('should call AppointmentType resource with query value', inject(function($rootScope) {
        var appointmentTypes;
        appointmentService.getAppointmentTypes("abc").then(function(results) {
            appointmentTypes = results;
        })

        deferredAppointmentTypeQuery.resolve({
            results: [
                { "display": "abc_appointment_type" }
            ]
        })

        $rootScope.$apply(); // see testing section of http://docs.angularjs.org/api/ng/service/$q

        expect(mockAppointmentType.query).toHaveBeenCalledWith({ "q": "abc", "v": "full" });
        expect(appointmentTypes.length).toBe(1);
        expect(appointmentTypes[0].display).toBe("abc_appointment_type");

    }));

    it('should reject AppointmentType and return reject reason', inject(function($rootScope) {
        var appointmentTypes;
        var rejectReason;

        appointmentService.getAppointmentTypes("abc").then(function(results) {
            appointmentTypes = results;
        }, function(reason) {
            rejectReason = reason;
        })

        deferredAppointmentTypeQuery.reject("failure")

        $rootScope.$apply(); // see testing section of http://docs.angularjs.org/api/ng/service/$q

        expect(mockAppointmentType.query).toHaveBeenCalledWith({ "q": "abc", "v": "full" });
        expect(appointmentTypes).toBe(undefined);
        expect(rejectReason).toBe("failure");
    }));


    it('should call TimeSlot resource with query value and default representation', inject(function($rootScope) {
        var timeSlots;
        appointmentService.getTimeSlots({ 'appointmentType' : '123abc' }).then(function(result) {
            timeSlots = result;
        });

        deferredTimeSlotQuery.resolve({
            results: [
                { "display": "some_time_slot" }
            ]
        })

        $rootScope.$apply(); // see testing section of http://docs.angularjs.org/api/ng/service/$q

        expect(mockTimeSlot.query).toHaveBeenCalledWith({ 'appointmentType' : '123abc', 'v': 'default'  });
        expect(timeSlots.length).toBe(1);
        expect(timeSlots[0].display).toBe("some_time_slot");
    }));

    it('should call TimeSlot resource with query value and full representation', inject(function($rootScope) {
        appointmentService.getTimeSlots({ 'appointmentType' : '123abc', 'v': 'ref' });
        expect(mockTimeSlot.query).toHaveBeenCalledWith({ 'appointmentType' : '123abc', 'v': 'ref'  });
    }));

    it('should call AppointmentBlock resource with query value and default representation', inject(function($rootScope) {
        var appointmentBlocks;
        appointmentService.getAppointmentBlocks({ 'appointmentType' : '123abc' }).then(function(result) {
            appointmentBlocks = result;
        });

        deferredAppointmentBlockQuery.resolve({
            results: [
                { "display": "some_appointment_block" }
            ]
        })

        $rootScope.$apply(); // see testing section of http://docs.angularjs.org/api/ng/service/$q

        expect(mockAppointmentBlock.query).toHaveBeenCalledWith({ 'appointmentType' : '123abc', 'v': 'default'  });
        expect(appointmentBlocks.length).toBe(1);
        expect(appointmentBlocks[0].display).toBe("some_appointment_block");
    }));

    it('should call AppointmentBlock resource with query value and full representation', function() {
        appointmentService.getAppointmentBlocks({ 'appointmentType' : '123abc', 'v': 'ref' });
        expect(mockAppointmentBlock.query).toHaveBeenCalledWith({ 'appointmentType' : '123abc', 'v': 'ref'  });
    });

    it('should call AppointmnetBlock resource save with appointment block value', function() {
        appointmentService.saveAppointmentBlock({'startDate': 'someDate', 'endDate': 'anotherDate', 'provider': '123', 'location': 'abc'});
        expect(mockAppointmentBlock.save).toHaveBeenCalledWith({'startDate': 'someDate', 'endDate': 'anotherDate', 'provider': '123', 'location': 'abc'});
    });

    it('should call AppointmentBlock resource delete with appointment uuid', function() {
        appointmentService.deleteAppointmentBlock("123abc");
        expect(mockAppointmentBlock.delete).toHaveBeenCalledWith({'uuid': '123abc'});
    });

    it('should call Appointment resource save with appointment value', function() {
        appointmentService.saveAppointment({ 'timeSlot': '123abc', 'patient': '456def', 'reason': 'someReason'});
        expect(mockAppointment.save).toHaveBeenCalledWith({ 'timeSlot': '123abc', 'patient': '456def', 'reason': 'someReason'});
    });

    it('should call AppointmentAllowingOverbook resource save with appointment value', function() {
        appointmentService.saveAppointment({ 'timeSlot': '123abc', 'patient': '456def', 'reason': 'someReason'}, true);
        expect(mockAppointmentAllowingOverbook.save).toHaveBeenCalledWith({ 'timeSlot': '123abc', 'patient': '456def', 'reason': 'someReason'});
    });


    it('should call Appointment resource save to cancel an appointment', function() {
        appointmentService.cancelAppointment({ 'uuid': 'uuid' });
        expect(mockAppointment.save).toHaveBeenCalledWith({ 'uuid': 'uuid', 'status': 'CANCELLED' });
    });

    it('should call Appointment resource with query value and default representation', inject(function($rootScope) {
        var appointments;
        appointmentService.getAppointments({ 'appointmentType' : '123abc' }).then(function(result) {
            appointments = result;
        });

        deferredAppointmentQuery.resolve({
            results: [
                { "display": "some_appointment" }
            ]
        })

        $rootScope.$apply(); // see testing section of http://docs.angularjs.org/api/ng/service/$q

        expect(mockAppointment.query).toHaveBeenCalledWith({ 'appointmentType' : '123abc', 'v': 'default'  });
        expect(appointments.length).toBe(1);
        expect(appointments[0].display).toBe("some_appointment");
    }));

    it('should call ScheduledAppointmentBlock resource with query value', inject(function($rootScope) {
        var scheduledAppointmentBlocks;
        appointmentService.getScheduledAppointmentBlocks({date: "2014-03-01", location: "uuidLocation"}).then(function(results) {
            scheduledAppointmentBlocks = results;
        });

        deferredScheduledAppointmentBlockQuery.resolve({
            results: [
                {
                    appointmentBlock: {
                        display: "Display some appointment block"
                    },
                    appointments: [
                        {
                         appointment: {
                             display: "Display some appointment"
                         }
                        }
                    ]
                }
            ]
        });

        $rootScope.$apply();
        expect(mockScheduledAppointmentBlock.query).toHaveBeenCalledWith({ 'date': '2014-03-01', 'location': 'uuidLocation'});
        expect(scheduledAppointmentBlocks.length).toBe(1);
        expect(scheduledAppointmentBlocks[0].appointmentBlock.display).toBe("Display some appointment block");
    }));

})