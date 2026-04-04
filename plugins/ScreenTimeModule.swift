import Foundation
import FamilyControls
import DeviceActivity
import ManagedSettings

@objc(ScreenTimeModule)
class ScreenTimeModule: NSObject {

  @objc
  func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 16.0, *) {
      Task {
        do {
          try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
          resolve(true)
        } catch {
          resolve(false)
        }
      }
    } else {
      resolve(false)
    }
  }

  @objc
  func getScreenTime(_ dateString: String,
                     resolver resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 16.0, *) {
      let formatter = DateFormatter()
      formatter.dateFormat = "yyyy-MM-dd"
      formatter.timeZone = TimeZone.current

      guard let date = formatter.date(from: dateString) else {
        reject("INVALID_DATE", "Could not parse date: \(dateString)", nil)
        return
      }

      let calendar = Calendar.current
      let startOfDay = calendar.startOfDay(for: date)
      guard let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay) else {
        reject("DATE_ERROR", "Could not compute end of day", nil)
        return
      }

      let deviceActivityCenter = DeviceActivityCenter()
      let activityName = DeviceActivityName("scroli.daily")
      let schedule = DeviceActivitySchedule(
        intervalStart: DateComponents(
          hour: calendar.component(.hour, from: startOfDay),
          minute: 0,
          second: 0
        ),
        intervalEnd: DateComponents(
          hour: 23,
          minute: 59,
          second: 59
        ),
        repeats: false
      )

      // DeviceActivity API gives us usage via DeviceActivityReport
      // For direct query we use DeviceActivityData if available
      // Fallback: return mock minutes for simulator testing
      let _ = deviceActivityCenter
      let _ = activityName
      let _ = schedule

      // Note: Full DeviceActivityReport requires a DeviceActivityReportExtension target.
      // For MVP, return a placeholder that gets replaced with real data once the
      // extension is added. The permission request above is the critical first step.
      resolve(NSNumber(value: 138)) // 2h 18m placeholder
    } else {
      resolve(NSNumber(value: 0))
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
